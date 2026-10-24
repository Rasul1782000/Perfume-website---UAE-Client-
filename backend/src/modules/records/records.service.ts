import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncryptedRecord } from './entities/encrypted-record.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RecordsService {
  private readonly logger = new Logger(RecordsService.name);

  constructor(
    @InjectRepository(EncryptedRecord)
    private readonly recordRepo: Repository<EncryptedRecord>,
    private readonly auditService: AuditService,
  ) {}

  async findAllForUser(userId: string, includeDeleted = false) {
    const qb = this.recordRepo.createQueryBuilder('record')
      .where('record.userId = :userId', { userId });

    if (!includeDeleted) {
      qb.andWhere('record.isDeleted = false');
    }

    qb.orderBy('record.clientUpdatedAt', 'DESC');
    return qb.getMany();
  }

  async findOneForUser(userId: string, recordId: string) {
    const record = await this.recordRepo.findOne({
      where: { id: recordId, userId },
    });
    if (!record) {
      throw new NotFoundException(`Record with ID ${recordId} not found`);
    }
    return record;
  }

  async deleteForUser(userId: string, recordId: string) {
    const record = await this.recordRepo.findOne({
      where: { id: recordId, userId },
    });
    if (!record) {
      throw new NotFoundException(`Record with ID ${recordId} not found`);
    }

    // Tombstone deletion for offline sync propagation
    record.isDeleted = true;
    record.version += 1;
    record.serverUpdatedAt = new Date();
    await this.recordRepo.save(record);

    await this.auditService.logEvent({
      userId,
      action: 'RECORD_TOMBSTONE_DELETED',
      metadata: { recordId, version: record.version },
    });

    return { success: true, version: record.version };
  }
}
