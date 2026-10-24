import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptedRecord } from '../records/entities/encrypted-record.entity';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([EncryptedRecord]), AuditModule],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
