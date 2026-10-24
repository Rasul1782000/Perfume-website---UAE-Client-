import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { OfflineStorageService } from './offline-storage.service';
import { CryptoService } from './crypto.service';
import { EncryptedRecordPayload } from '../models/medical-record.model';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  lastError: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private apiUrl = 'https://api.vaultmed.security/api/v1'; // Or local NestJS port
  private isOnline = true;
  private isSyncing = false;
  private lastSyncTime: string | null = null;
  private pendingCount = 0;
  private lastError: string | null = null;

  constructor(
    private offlineStorage: OfflineStorageService,
    private cryptoService: CryptoService,
  ) {
    this.initNetworkMonitoring();
  }

  private async initNetworkMonitoring() {
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    Network.addListener('networkStatusChange', async (netStatus) => {
      this.isOnline = netStatus.connected;
      if (this.isOnline) {
        // Auto-trigger delta sync when returning online
        await this.syncDelta();
      }
    });

    const { value } = await Preferences.get({ key: 'last_sync_timestamp' });
    this.lastSyncTime = value;
  }

  async syncDelta(): Promise<void> {
    if (!this.isOnline || this.isSyncing) return;

    this.isSyncing = true;
    this.lastError = null;

    try {
      const pendingMutations = await this.offlineStorage.getPendingMutations();
      this.pendingCount = pendingMutations.length;

      const { value: authToken } = await Preferences.get({ key: 'auth_jwt_token' });
      const { value: deviceId } = await Preferences.get({ key: 'device_uuid' });

      const requestBody = {
        lastSyncTimestamp: this.lastSyncTime,
        mutations: pendingMutations,
        clientDeviceId: deviceId || 'capacitor-mobile-client',
      };

      const response = await fetch(`${this.apiUrl}/sync/delta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken || ''}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Sync server responded with status ${response.status}`);
      }

      const syncResult = await response.json();

      // Mark accepted client mutations as synced
      if (syncResult.acceptedIds && syncResult.acceptedIds.length > 0) {
        await this.offlineStorage.markAsSynced(syncResult.acceptedIds);
      }

      // Store server delta updates into local offline database
      if (syncResult.serverUpdates && syncResult.serverUpdates.length > 0) {
        for (const update of syncResult.serverUpdates) {
          await this.offlineStorage.saveRecord(update, false);
        }
      }

      // Update sync watermark
      this.lastSyncTime = syncResult.syncTimestamp;
      await Preferences.set({ key: 'last_sync_timestamp', value: syncResult.syncTimestamp });

      // Re-evaluate pending count
      const remaining = await this.offlineStorage.getPendingMutations();
      this.pendingCount = remaining.length;
    } catch (err: any) {
      this.lastError = err.message || 'Synchronization failure';
      console.error('Offline Sync Error:', err);
    } finally {
      this.isSyncing = false;
    }
  }

  getStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: this.pendingCount,
      lastSyncTime: this.lastSyncTime,
      lastError: this.lastError,
    };
  }
}
