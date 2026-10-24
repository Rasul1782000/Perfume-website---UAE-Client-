import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { OfflineStorageService } from './offline-storage.service';
import { SyncService } from './sync.service';
import {
  LocalMedicalRecord,
  MedicalRecordType,
  PlaintextMedicalData,
  EncryptedRecordPayload,
} from '../models/medical-record.model';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordsService {
  private decryptedRecordsCache: LocalMedicalRecord[] = [];

  constructor(
    private cryptoService: CryptoService,
    private storage: OfflineStorageService,
    private syncService: SyncService,
  ) {}

  /**
   * Creates a new encrypted medical record, stores locally, and queues for sync.
   */
  async createRecord(
    recordType: MedicalRecordType,
    title: string,
    summary: string,
    payload: PlaintextMedicalData,
  ): Promise<LocalMedicalRecord> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const plaintextRecordData = {
      title,
      summary,
      payload,
    };

    // Encrypt client-side using WebCrypto AES-256-GCM
    const encrypted = await this.cryptoService.encryptPayload(plaintextRecordData);

    const wirePayload: EncryptedRecordPayload = {
      id,
      recordType,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      keyFingerprint: encrypted.keyFingerprint,
      version: 1,
      isDeleted: false,
      clientCreatedAt: now,
      clientUpdatedAt: now,
      checksum: encrypted.checksum,
    };

    // Save into local offline SQLite / IndexedDB
    await this.storage.saveRecord(wirePayload, true);

    const localRecord: LocalMedicalRecord = {
      id,
      recordType,
      title,
      summary,
      payload,
      clientCreatedAt: now,
      clientUpdatedAt: now,
      version: 1,
      isDeleted: false,
      pendingSync: true,
      keyFingerprint: encrypted.keyFingerprint,
    };

    this.decryptedRecordsCache.unshift(localRecord);

    // Opportunistically sync delta in background if online
    this.syncService.syncDelta().catch((err) => console.log('Offline: sync queued'));

    return localRecord;
  }

  /**
   * Fetches and decrypts all records stored locally on the device.
   */
  async loadAllDecryptedRecords(): Promise<LocalMedicalRecord[]> {
    const rawEncryptedList = await this.storage.getAllActiveRecords();
    const results: LocalMedicalRecord[] = [];

    for (const item of rawEncryptedList) {
      try {
        const decrypted = await this.cryptoService.decryptPayload(
          item.ciphertext,
          item.iv,
          item.authTag,
        );

        results.push({
          id: item.id,
          recordType: item.recordType,
          title: decrypted.title,
          summary: decrypted.summary,
          payload: decrypted.payload,
          clientCreatedAt: item.clientCreatedAt,
          clientUpdatedAt: item.clientUpdatedAt,
          version: item.version,
          isDeleted: item.isDeleted,
          pendingSync: (item as any).pendingSync ?? false,
          keyFingerprint: item.keyFingerprint,
        });
      } catch (err) {
        console.error(`Failed to decrypt record ${item.id}:`, err);
      }
    }

    this.decryptedRecordsCache = results;
    return results;
  }

  /**
   * Soft-deletes a record with tombstone synchronization.
   */
  async deleteRecord(id: string): Promise<void> {
    const existing = this.decryptedRecordsCache.find((r) => r.id === id);
    if (!existing) return;

    const now = new Date().toISOString();
    const encrypted = await this.cryptoService.encryptPayload({ tombstone: true });

    const tombstonePayload: EncryptedRecordPayload = {
      id,
      recordType: existing.recordType,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      keyFingerprint: encrypted.keyFingerprint,
      version: existing.version + 1,
      isDeleted: true,
      clientCreatedAt: existing.clientCreatedAt,
      clientUpdatedAt: now,
      checksum: encrypted.checksum,
    };

    await this.storage.saveRecord(tombstonePayload, true);
    this.decryptedRecordsCache = this.decryptedRecordsCache.filter((r) => r.id !== id);

    this.syncService.syncDelta().catch(() => {});
  }
}
