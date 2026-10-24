import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  action: string; // 'SYNC_PULL' | 'SYNC_PUSH' | 'RECORD_CREATE' | 'RECORD_UPDATE' | 'RECORD_DELETE' | 'KEY_ROTATION' | 'AUTH_LOGIN'

  @Column({ type: 'varchar', length: 100, nullable: true })
  clientDeviceId: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * SHA-256 hash of the previous log entry, forming a tamper-evident blockchain-style hash chain
   * to comply with medical record audit trail non-repudiation standards.
   */
  @Column({ type: 'varchar', length: 64, nullable: true })
  previousEntryHash: string;

  /**
   * SHA-256 hash of (previousEntryHash + id + userId + action + createdAt + metadata).
   */
  @Column({ type: 'varchar', length: 64 })
  entryHash: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
