import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('encrypted_records')
@Index(['userId', 'serverUpdatedAt'])
@Index(['userId', 'isDeleted'])
export class EncryptedRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  recordType: string; // 'lab_result' | 'vital_signs' | 'prescription' | 'clinical_note' | 'allergy' | 'immunization'

  /**
   * AES-256-GCM Encrypted payload (Base64 encoded).
   * Plaintext is NEVER sent to or stored on the server.
   */
  @Column({ type: 'text' })
  ciphertext: string;

  /**
   * 12-byte Initialization Vector (Base64 encoded).
   * Unique per encryption operation.
   */
  @Column({ type: 'varchar', length: 64 })
  iv: string;

  /**
   * 128-bit Authentication Tag (Base64 encoded).
   */
  @Column({ type: 'varchar', length: 64 })
  authTag: string;

  /**
   * SHA-256 fingerprint of the client key used to encrypt this record.
   * Enables client to detect key rotation or identify which device key was used.
   */
  @Column({ type: 'varchar', length: 64 })
  keyFingerprint: string;

  /**
   * Monotonically increasing revision number used for conflict detection and vector clocks.
   */
  @Column({ type: 'int', default: 1 })
  version: number;

  /**
   * Soft-delete tombstone to synchronize record deletions across offline devices.
   */
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  /**
   * Client-side creation timestamp when record was generated (even if offline).
   */
  @Column({ type: 'timestamp with time zone' })
  clientCreatedAt: Date;

  /**
   * Client-side last modification timestamp.
   */
  @Column({ type: 'timestamp with time zone' })
  clientUpdatedAt: Date;

  /**
   * Server timestamp assigned atomically on commit for incremental delta syncing.
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  serverUpdatedAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  serverCreatedAt: Date;

  /**
   * Cryptographic integrity hash of the payload (SHA-256 of ciphertext + iv + authTag).
   */
  @Column({ type: 'varchar', length: 64 })
  checksum: string;
}
