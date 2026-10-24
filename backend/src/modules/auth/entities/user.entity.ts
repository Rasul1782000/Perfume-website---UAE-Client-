import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EncryptedRecord } from '../../records/entities/encrypted-record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /**
   * Password hash using Argon2id for server-side authentication.
   * Kept completely separate from the client-side E2EE master key.
   */
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  /**
   * 32-byte salt (Base64) provided back to the client during login
   * to deterministically derive the client-side Master Encryption Key via PBKDF2.
   * The server never sees or knows the master encryption key.
   */
  @Column({ type: 'varchar', length: 128 })
  keyDerivationSalt: string;

  /**
   * Number of PBKDF2 iterations configured for this user (standard: 600,000 rounds).
   */
  @Column({ type: 'int', default: 600000 })
  pbkdf2Rounds: number;

  /**
   * Client's Master Key Fingerprint (SHA-256) used for device verification.
   */
  @Column({ type: 'varchar', length: 64, nullable: true })
  masterKeyFingerprint: string;

  /**
   * Encrypted Master Key Backup (encrypted client-side using a 12-word recovery mnemonic).
   * Allows multi-device recovery without breaking Zero-Knowledge guarantees.
   */
  @Column({ type: 'text', nullable: true })
  encryptedKeyBackup: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => EncryptedRecord, (record) => record.user)
  records: EncryptedRecord[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
