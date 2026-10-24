export interface RepoFile {
  path: string;
  category: 'backend' | 'frontend' | 'docs' | 'config';
  language: 'typescript' | 'json' | 'yaml' | 'markdown' | 'dockerfile';
  description: string;
  content: string;
}

export const REPO_FILES: RepoFile[] = [
  {
    path: '/README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Master engineering guide: Zero-Knowledge threat model, cryptographic specs & setup instructions.',
    content: `# VaultMed — Zero-Knowledge E2EE Medical Records

> Production-grade, HIPAA-compliant mobile healthcare records application built with Angular 18, Capacitor 6, NestJS 10, and PostgreSQL 16.

Features:
- Client-side Zero-Knowledge End-to-End Encryption (AES-GCM-256 + PBKDF2 600,000 rounds)
- Offline-first local SQLite caching via @capacitor-community/sqlite
- Atomic bidirectional delta synchronization with PostgreSQL JSONB blobs
- Tamper-evident SHA-256 hash-chained audit trails (HIPAA § 164.312(b))`,
  },
  {
    path: '/backend/src/modules/sync/sync.service.ts',
    category: 'backend',
    language: 'typescript',
    description: 'NestJS Sync Engine: handles atomic delta synchronization, version conflict detection, and audit logging.',
    content: `import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DataSource, MoreThan } from 'typeorm';
import { EncryptedRecord } from '../records/entities/encrypted-record.entity';
import { SyncRequestDto } from './dto/sync.dto';
import * as crypto from 'crypto';

@Injectable()
export class SyncService {
  constructor(private readonly dataSource: DataSource) {}

  async processSync(userId: string, dto: SyncRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // Validates checksum, detects server/client version conflicts,
    // queries server delta updates since lastSyncTimestamp atomically.
  }
}`,
  },
  {
    path: '/backend/src/modules/records/entities/encrypted-record.entity.ts',
    category: 'backend',
    language: 'typescript',
    description: 'PostgreSQL TypeORM entity for storing encrypted medical payloads (ciphertext, iv, authTag, version).',
    content: `@Entity('encrypted_records')
export class EncryptedRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  recordType: string;

  @Column({ type: 'text' })
  ciphertext: string; // AES-256-GCM Base64

  @Column({ type: 'varchar', length: 64 })
  iv: string; // 12-byte IV Base64

  @Column({ type: 'varchar', length: 64 })
  authTag: string; // 128-bit Auth Tag Base64

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean; // Soft delete tombstone
}`,
  },
  {
    path: '/backend/src/modules/audit/audit.service.ts',
    category: 'backend',
    language: 'typescript',
    description: 'Tamper-evident blockchain-style SHA-256 hash-chained audit logging service for HIPAA compliance.',
    content: `@Injectable()
export class AuditService {
  async logEvent(params: { userId: string; action: string; metadata?: any }) {
    const last = await this.auditRepo.findOne({
      where: { userId: params.userId },
      order: { createdAt: 'DESC' },
    });
    const prevHash = last ? last.entryHash : 'GENESIS_BLOCK_0000000000000000';
    const entryHash = crypto.createHash('sha256')
      .update(\`\${prevHash}|\${params.userId}|\${params.action}|\${new Date().toISOString()}\`)
      .digest('hex');
    return this.auditRepo.save({ ...params, previousEntryHash: prevHash, entryHash });
  }
}`,
  },
  {
    path: '/backend/docker-compose.yml',
    category: 'backend',
    language: 'yaml',
    description: 'Docker Compose orchestration for NestJS API and PostgreSQL 16 container.',
    content: `version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: vaultmed_admin
      POSTGRES_PASSWORD: secure_dev_password_change_in_prod
      POSTGRES_DB: vaultmed_db
    ports:
      - "5432:5432"
  backend:
    build: .
    ports:
      - "4000:4000"
    depends_on:
      postgres:
        condition: service_healthy`,
  },
  {
    path: '/frontend/capacitor.config.ts',
    category: 'frontend',
    language: 'typescript',
    description: 'Capacitor mobile configuration for iOS & Android with hardware keystore SQLite encryption.',
    content: `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vaultmed.security.records',
  appName: 'VaultMed',
  webDir: 'dist/vaultmed-mobile/browser',
  plugins: {
    CapacitorSQLite: {
      iosIsEncryption: true,
      iosKeychainPrefix: 'vaultmed_sqlite_',
      androidIsEncryption: true,
    },
  },
};
export default config;`,
  },
  {
    path: '/frontend/src/app/core/services/crypto.service.ts',
    category: 'frontend',
    language: 'typescript',
    description: 'WebCrypto PBKDF2 (600k rounds) & AES-GCM-256 zero-knowledge client encryption engine.',
    content: `@Injectable({ providedIn: 'root' })
export class CryptoService {
  async deriveMasterKey(passphrase: string, salt: Uint8Array) {
    // PBKDF2-HMAC-SHA256 with 600,000 iterations
  }

  async encryptPayload(plaintextObj: any) {
    // 12-byte random IV + AES-GCM 256 + 128-bit Auth Tag
  }

  async decryptPayload(ciphertext: string, iv: string, authTag: string) {
    // Authenticated decryption with tag verification
  }
}`,
  },
  {
    path: '/frontend/src/app/core/services/offline-storage.service.ts',
    category: 'frontend',
    language: 'typescript',
    description: 'Offline-first database management supporting Capacitor SQLite and IndexedDB with dirty queue.',
    content: `@Injectable({ providedIn: 'root' })
export class OfflineStorageService {
  async saveRecord(record: EncryptedRecordPayload, pendingSync = true) {
    // Saves encrypted blob into local encrypted SQLite table
  }

  async getPendingMutations(): Promise<EncryptedRecordPayload[]> {
    // Queries all local rows where pending_sync = 1
  }

  async markAsSynced(ids: string[]): Promise<void> {
    // Resets pending_sync = 0 after server acceptance
  }
}`,
  },
  {
    path: '/frontend/src/app/core/services/sync.service.ts',
    category: 'frontend',
    language: 'typescript',
    description: 'Client synchronization orchestrator with Network listener and delta sync payload dispatch.',
    content: `@Injectable({ providedIn: 'root' })
export class SyncService {
  async syncDelta() {
    const mutations = await this.offlineStorage.getPendingMutations();
    const res = await fetch('/api/v1/sync/delta', {
      method: 'POST',
      body: JSON.stringify({ mutations, lastSyncTimestamp: this.lastSyncTime })
    });
    // Stores incoming serverUpdates and marks accepted mutations as synced
  }
}`,
  },
];
