import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private masterKey: CryptoKey | null = null;
  private keyFingerprint: string | null = null;
  private currentSalt: Uint8Array | null = null;
  private readonly PBKDF2_ROUNDS = 600000;

  /**
   * Generates a cryptographically secure 32-byte salt for PBKDF2.
   */
  generateSalt(): Uint8Array {
    const salt = new Uint8Array(32);
    crypto.getRandomValues(salt);
    return salt;
  }

  /**
   * Derives a 256-bit AES-GCM Master Key from the user passphrase and salt
   * using PBKDF2-HMAC-SHA256 with 600,000 iterations.
   */
  async deriveMasterKey(passphrase: string, salt: Uint8Array): Promise<{ key: CryptoKey; fingerprint: string }> {
    const enc = new TextEncoder();
    const passphraseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations: this.PBKDF2_ROUNDS,
        hash: 'SHA-256',
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      true, // extractable for fingerprinting and biometric storage
      ['encrypt', 'decrypt'],
    );

    // Compute key fingerprint (SHA-256 of raw key bytes)
    const rawKey = await crypto.subtle.exportKey('raw', derivedKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', rawKey);
    const fingerprint = this.buf2hex(new Uint8Array(hashBuffer)).substring(0, 32);

    this.masterKey = derivedKey;
    this.keyFingerprint = fingerprint;
    this.currentSalt = salt;

    return { key: derivedKey, fingerprint };
  }

  /**
   * Encrypts plaintext JSON payload into AES-256-GCM ciphertext + IV + AuthTag.
   */
  async encryptPayload(plaintextObj: any): Promise<{
    ciphertext: string;
    iv: string;
    authTag: string;
    keyFingerprint: string;
    checksum: string;
  }> {
    if (!this.masterKey || !this.keyFingerprint) {
      throw new Error('Master encryption key not unlocked in memory');
    }

    const enc = new TextEncoder();
    const encodedData = enc.encode(JSON.stringify(plaintextObj));

    // 12-byte unique IV for AES-GCM
    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);

    // Encrypt with WebCrypto AES-GCM (returns ciphertext + 16-byte tag appended)
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv.buffer as ArrayBuffer,
        tagLength: 128,
      },
      this.masterKey,
      encodedData,
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const tagLength = 16;
    const ciphertextBytes = encryptedBytes.slice(0, encryptedBytes.length - tagLength);
    const authTagBytes = encryptedBytes.slice(encryptedBytes.length - tagLength);

    const ciphertext = this.buf2base64(ciphertextBytes);
    const ivBase64 = this.buf2base64(iv);
    const authTagBase64 = this.buf2base64(authTagBytes);

    // Calculate integrity checksum
    const checksum = await this.calculateChecksum(ciphertext, ivBase64, authTagBase64);

    return {
      ciphertext,
      iv: ivBase64,
      authTag: authTagBase64,
      keyFingerprint: this.keyFingerprint,
      checksum,
    };
  }

  /**
   * Decrypts AES-256-GCM ciphertext + IV + AuthTag back into plaintext JSON object.
   */
  async decryptPayload(ciphertextBase64: string, ivBase64: string, authTagBase64: string): Promise<any> {
    if (!this.masterKey) {
      throw new Error('Master encryption key not unlocked in memory');
    }

    const ciphertextBytes = this.base642buf(ciphertextBase64);
    const ivBytes = this.base642buf(ivBase64);
    const authTagBytes = this.base642buf(authTagBase64);

    // Concatenate ciphertext and 16-byte authentication tag for WebCrypto decrypt
    const combined = new Uint8Array(ciphertextBytes.length + authTagBytes.length);
    combined.set(ciphertextBytes, 0);
    combined.set(authTagBytes, ciphertextBytes.length);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBytes.buffer as ArrayBuffer,
        tagLength: 128,
      },
      this.masterKey,
      combined.buffer as ArrayBuffer,
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedBuffer));
  }

  /**
   * Computes SHA-256 integrity checksum for ciphertext integrity verification.
   */
  async calculateChecksum(ciphertext: string, iv: string, authTag: string): Promise<string> {
    const enc = new TextEncoder();
    const data = enc.encode(`${ciphertext}|${iv}|${authTag}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.buf2hex(new Uint8Array(hashBuffer));
  }

  /**
   * Safely purges master key material from volatile memory when app backgrounds or locks.
   */
  purgeKeyMaterial(): void {
    this.masterKey = null;
    this.keyFingerprint = null;
  }

  isUnlocked(): boolean {
    return this.masterKey !== null;
  }

  getKeyFingerprint(): string | null {
    return this.keyFingerprint;
  }

  getCurrentSaltBase64(): string | null {
    return this.currentSalt ? this.buf2base64(this.currentSalt) : null;
  }

  // --- Utility Methods ---

  buf2base64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  base642buf(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  buf2hex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
