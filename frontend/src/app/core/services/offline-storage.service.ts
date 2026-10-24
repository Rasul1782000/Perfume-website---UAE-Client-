import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { LocalMedicalRecord, EncryptedRecordPayload } from '../models/medical-record.model';

@Injectable({
  providedIn: 'root',
})
export class OfflineStorageService {
  private sqlite: SQLiteConnection | null = null;
  private db: SQLiteDBConnection | null = null;
  private isNative: boolean = false;
  private readonly DB_NAME = 'vaultmed_offline_store';

  // Fallback IndexedDB database for web/preview
  private idb: IDBDatabase | null = null;

  async init(): Promise<void> {
    this.isNative = Capacitor.isNativePlatform();

    if (this.isNative) {
      await this.initNativeSqlite();
    } else {
      await this.initIndexedDb();
    }
  }

  private async initNativeSqlite(): Promise<void> {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.db = await this.sqlite.createConnection(
      this.DB_NAME,
      true, // encrypted database
      'secret', // uses iOS Keychain / Android KeyStore
      1,
      false,
    );
    await this.db.open();

    const schema = `
      CREATE TABLE IF NOT EXISTS local_records (
        id TEXT PRIMARY KEY NOT NULL,
        record_type TEXT NOT NULL,
        ciphertext TEXT NOT NULL,
        iv TEXT NOT NULL,
        auth_tag TEXT NOT NULL,
        key_fingerprint TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        is_deleted INTEGER NOT NULL DEFAULT 0,
        pending_sync INTEGER NOT NULL DEFAULT 1,
        client_created_at TEXT NOT NULL,
        client_updated_at TEXT NOT NULL,
        checksum TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_pending_sync ON local_records(pending_sync);
      CREATE INDEX IF NOT EXISTS idx_updated_at ON local_records(client_updated_at);
    `;
    await this.db.execute(schema);
  }

  private async initIndexedDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('local_records')) {
          const store = db.createObjectStore('local_records', { keyPath: 'id' });
          store.createIndex('pending_sync', 'pendingSync', { unique: false });
          store.createIndex('client_updated_at', 'clientUpdatedAt', { unique: false });
        }
      };
      request.onsuccess = (event: any) => {
        this.idb = event.target.result;
        resolve();
      };
      request.onerror = (err) => reject(err);
    });
  }

  /**
   * Saves or updates an encrypted record in local offline store.
   */
  async saveRecord(record: EncryptedRecordPayload, pendingSync = true): Promise<void> {
    if (this.isNative && this.db) {
      const query = `
        INSERT OR REPLACE INTO local_records (
          id, record_type, ciphertext, iv, auth_tag, key_fingerprint,
          version, is_deleted, pending_sync, client_created_at, client_updated_at, checksum
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await this.db.run(query, [
        record.id,
        record.recordType,
        record.ciphertext,
        record.iv,
        record.authTag,
        record.keyFingerprint,
        record.version,
        record.isDeleted ? 1 : 0,
        pendingSync ? 1 : 0,
        record.clientCreatedAt,
        record.clientUpdatedAt,
        record.checksum,
      ]);
    } else if (this.idb) {
      return new Promise((resolve, reject) => {
        const tx = this.idb!.transaction('local_records', 'readwrite');
        const store = tx.objectStore('local_records');
        store.put({
          ...record,
          pendingSync,
        });
        tx.oncomplete = () => resolve();
        tx.onerror = (err) => reject(err);
      });
    }
  }

  /**
   * Retrieves all records marked as pendingSync = true to push to NestJS backend.
   */
  async getPendingMutations(): Promise<EncryptedRecordPayload[]> {
    if (this.isNative && this.db) {
      const res = await this.db.query('SELECT * FROM local_records WHERE pending_sync = 1');
      return (res.values || []).map((row: any) => ({
        id: row.id,
        recordType: row.record_type,
        ciphertext: row.ciphertext,
        iv: row.iv,
        authTag: row.auth_tag,
        keyFingerprint: row.key_fingerprint,
        version: row.version,
        isDeleted: row.is_deleted === 1,
        clientCreatedAt: row.client_created_at,
        clientUpdatedAt: row.client_updated_at,
        checksum: row.checksum,
      }));
    } else if (this.idb) {
      return new Promise((resolve, reject) => {
        const tx = this.idb!.transaction('local_records', 'readonly');
        const store = tx.objectStore('local_records');
        const req = store.getAll();
        req.onsuccess = () => {
          const records: any[] = req.result || [];
          resolve(records.filter((r) => r.pendingSync));
        };
        req.onerror = (err) => reject(err);
      });
    }
    return [];
  }

  /**
   * Marks records as synced once accepted by the server.
   */
  async markAsSynced(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    if (this.isNative && this.db) {
      const placeholders = ids.map(() => '?').join(',');
      await this.db.run(`UPDATE local_records SET pending_sync = 0 WHERE id IN (${placeholders})`, ids);
    } else if (this.idb) {
      const tx = this.idb.transaction('local_records', 'readwrite');
      const store = tx.objectStore('local_records');
      for (const id of ids) {
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          if (getReq.result) {
            getReq.result.pendingSync = false;
            store.put(getReq.result);
          }
        };
      }
    }
  }

  /**
   * Gets all active (non-tombstoned) records from local offline store.
   */
  async getAllActiveRecords(): Promise<EncryptedRecordPayload[]> {
    if (this.isNative && this.db) {
      const res = await this.db.query('SELECT * FROM local_records WHERE is_deleted = 0 ORDER BY client_updated_at DESC');
      return (res.values || []).map((row: any) => ({
        id: row.id,
        recordType: row.record_type,
        ciphertext: row.ciphertext,
        iv: row.iv,
        authTag: row.auth_tag,
        keyFingerprint: row.key_fingerprint,
        version: row.version,
        isDeleted: row.is_deleted === 1,
        clientCreatedAt: row.client_created_at,
        clientUpdatedAt: row.client_updated_at,
        checksum: row.checksum,
      }));
    } else if (this.idb) {
      return new Promise((resolve, reject) => {
        const tx = this.idb!.transaction('local_records', 'readonly');
        const store = tx.objectStore('local_records');
        const req = store.getAll();
        req.onsuccess = () => {
          const records: any[] = req.result || [];
          resolve(records.filter((r) => !r.isDeleted));
        };
        req.onerror = (err) => reject(err);
      });
    }
    return [];
  }
}
