import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DataSource, MoreThan } from 'typeorm';
import { EncryptedRecord } from '../records/entities/encrypted-record.entity';
import { SyncRequestDto, ClientMutationDto } from './dto/sync.dto';
import { AuditService } from '../audit/audit.service';
import * as crypto from 'crypto';

export interface SyncResponse {
  acceptedIds: string[];
  conflicts: Array<{
    clientRecordId: string;
    serverRecord: EncryptedRecord;
    reason: string;
  }>;
  serverUpdates: EncryptedRecord[];
  syncTimestamp: string;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Executes atomic bidirectional delta synchronization.
   * 1. Applies client mutations into Postgres.
   * 2. Detects version conflicts.
   * 3. Fetches all server delta updates since lastSyncTimestamp.
   * 4. Logs cryptographic audit record.
   */
  async processSync(
    userId: string,
    dto: SyncRequestDto,
    ip?: string,
    userAgent?: string,
  ): Promise<SyncResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const acceptedIds: string[] = [];
    const conflicts: Array<{
      clientRecordId: string;
      serverRecord: EncryptedRecord;
      reason: string;
    }> = [];

    const now = new Date();

    try {
      const recordRepo = queryRunner.manager.getRepository(EncryptedRecord);

      // Process incoming client mutations
      for (const mutation of dto.mutations) {
        // Verify payload cryptographic checksum
        const calculatedChecksum = crypto
          .createHash('sha256')
          .update(`${mutation.ciphertext}|${mutation.iv}|${mutation.authTag}`)
          .digest('hex');

        if (mutation.checksum && mutation.checksum !== calculatedChecksum) {
          throw new BadRequestException(
            `Cryptographic checksum mismatch for record ${mutation.id}. Possible payload tampering.`,
          );
        }

        const existing = await recordRepo.findOne({
          where: { id: mutation.id, userId },
        });

        if (existing) {
          // Conflict check: if server has a higher version or later serverUpdatedAt
          if (existing.version > mutation.version) {
            conflicts.push({
              clientRecordId: mutation.id,
              serverRecord: existing,
              reason: `Server has newer version (${existing.version} > ${mutation.version})`,
            });
            continue;
          }

          // Update existing encrypted blob
          existing.recordType = mutation.recordType;
          existing.ciphertext = mutation.ciphertext;
          existing.iv = mutation.iv;
          existing.authTag = mutation.authTag;
          existing.keyFingerprint = mutation.keyFingerprint;
          existing.version = existing.version + 1;
          existing.isDeleted = mutation.isDeleted;
          existing.clientUpdatedAt = new Date(mutation.clientUpdatedAt);
          existing.serverUpdatedAt = now;
          existing.checksum = calculatedChecksum;

          await recordRepo.save(existing);
          acceptedIds.push(mutation.id);
        } else {
          // Insert new encrypted record
          const newRecord = recordRepo.create({
            id: mutation.id,
            userId,
            recordType: mutation.recordType,
            ciphertext: mutation.ciphertext,
            iv: mutation.iv,
            authTag: mutation.authTag,
            keyFingerprint: mutation.keyFingerprint,
            version: mutation.version || 1,
            isDeleted: mutation.isDeleted || false,
            clientCreatedAt: new Date(mutation.clientCreatedAt),
            clientUpdatedAt: new Date(mutation.clientUpdatedAt),
            serverUpdatedAt: now,
            checksum: calculatedChecksum,
          });

          await recordRepo.save(newRecord);
          acceptedIds.push(mutation.id);
        }
      }

      // Query server updates since lastSyncTimestamp that were NOT in the current push
      let serverUpdates: EncryptedRecord[] = [];
      if (dto.lastSyncTimestamp) {
        const lastSyncDate = new Date(dto.lastSyncTimestamp);
        const candidates = await recordRepo.find({
          where: {
            userId,
            serverUpdatedAt: MoreThan(lastSyncDate),
          },
        });

        // Filter out records accepted in this exact mutation batch
        const acceptedSet = new Set(acceptedIds);
        serverUpdates = candidates.filter((r) => !acceptedSet.has(r.id));
      } else {
        // Initial sync: fetch all existing records for this user
        const candidates = await recordRepo.find({
          where: { userId },
        });
        const acceptedSet = new Set(acceptedIds);
        serverUpdates = candidates.filter((r) => !acceptedSet.has(r.id));
      }

      await queryRunner.commitTransaction();

      // Log sync audit trail
      await this.auditService.logEvent({
        userId,
        action: 'SYNC_DELTA',
        clientDeviceId: dto.clientDeviceId,
        ipAddress: ip,
        userAgent,
        metadata: {
          acceptedCount: acceptedIds.length,
          conflictsCount: conflicts.length,
          serverUpdatesCount: serverUpdates.length,
          clientLastSync: dto.lastSyncTimestamp || 'INITIAL_SYNC',
        },
      });

      return {
        acceptedIds,
        conflicts,
        serverUpdates,
        syncTimestamp: now.toISOString(),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Sync transaction rolled back: ${err.message}`, err.stack);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
