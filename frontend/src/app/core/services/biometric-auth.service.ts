import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class BiometricAuthService {
  private isLocked = true;
  private autoLockTimeoutMs = 120000; // 2 minutes inactivity auto-lock
  private timeoutTimer: any = null;

  constructor(private cryptoService: CryptoService) {
    this.registerAppLifecycleListeners();
  }

  private registerAppLifecycleListeners() {
    App.addListener('appStateChange', (state) => {
      if (!state.isActive) {
        // Automatically lock app and purge master key when backgrounded
        this.lockApp();
      }
    });
  }

  /**
   * Resets the inactivity timer whenever user touches the screen.
   */
  recordUserActivity() {
    if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
    this.timeoutTimer = setTimeout(() => {
      this.lockApp();
    }, this.autoLockTimeoutMs);
  }

  lockApp() {
    this.isLocked = true;
    this.cryptoService.purgeKeyMaterial();
    if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
  }

  unlockWithPinOrBiometrics(success: boolean) {
    if (success) {
      this.isLocked = false;
      this.recordUserActivity();
    }
  }

  getIsLocked(): boolean {
    return this.isLocked;
  }
}
