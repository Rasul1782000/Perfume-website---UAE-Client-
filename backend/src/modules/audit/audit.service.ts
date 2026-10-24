import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  /**
   * Appends an immutable, hash-chained audit event to the tamper-evident ledger.
   */
  async logEvent(params: {
    userId: string;
    action: string;
    clientDeviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<AuditLog> {
    const lastEntry = await this.auditRepo.findOne({
      where: { userId: params.userId },
      order: { createdAt: 'DESC' },
    });

    const previousHash = lastEntry ? lastEntry.entryHash : 'GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000';
    const timestamp = new Date();

    const dataToHash = `${previousHash}|${params.userId}|${params.action}|${timestamp.toISOString()}|${JSON.stringify(
      params.metadata || {},
    )}`;

    const entryHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    const log = this.auditRepo.create({
      userId: params.userId,
      action: params.action,
      clientDeviceId: params.clientDeviceId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: params.metadata,
      previousEntryHash: previousHash,
      entryHash,
      createdAt: timestamp,
    });

    return await this.auditRepo.save(log);
  }

  /**
   * Verifies the cryptographic integrity of a user's audit chain.
   */
  async verifyIntegrity(userId: string): Promise<{ valid: boolean; totalEntries: number; brokenIndex?: number }> {
    const logs = await this.auditRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });

    let previousHash = 'GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < logs.length; i++) {
      const entry = logs[i];
      if (entry.previousEntryHash !== previousHash) {
        return { valid: false, totalEntries: logs.length, brokenIndex: i };
      }

      const calculated = crypto
        .createHash('sha256')
        .update(
          `${previousHash}|${entry.userId}|${entry.action}|${entry.createdAt.toISOString()}|${JSON.stringify(
            entry.metadata || {},
          )}`,
        )
        .digest('hex');

      if (calculated !== entry.entryHash) {
        return { valid: false, totalEntries: logs.length, brokenIndex: i };
      }

      previousHash = entry.entryHash;
    }

    return { valid: true, totalEntries: logs.length };
  }
}
