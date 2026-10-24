# VaultMed — Zero-Knowledge E2EE Medical Records

> Production-grade, HIPAA-compliant mobile healthcare records application built with **Angular 18**, **Capacitor 6**, **NestJS 10**, and **PostgreSQL 16**. Engineered with client-side Zero-Knowledge End-to-End Encryption (E2EE), offline-first local SQLite caching, and atomic bidirectional delta synchronization.

---

## 1. System Architecture & Threat Model

VaultMed is architected around a **Zero-Trust, Zero-Knowledge Security Model**. Medical data is treated as high-risk Protected Health Information (PHI).

```
+-----------------------------------------------------------------------------------+
|                           CLIENT DEVICE (Angular + Capacitor)                     |
|                                                                                   |
|  [ User Interface ]  --->  [ Plaintext PHI ]                                      |
|                                   |                                               |
|                    [ WebCrypto SubtlCrypto Engine ]                               |
|                    - PBKDF2 (600,000 rounds, SHA-256)                             |
|                    - AES-GCM 256-bit (12-byte IV + 128-bit Tag)                   |
|                                   |                                               |
|                      [ Encrypted Blob (Base64) ]                                  |
|                                   |                                               |
|  [ Capacitor SQLite (Encrypted) ] <---+---> [ Offline Sync Queue (Dirty Bit) ]    |
+---------------------------------------|-------------------------------------------+
                                        |  HTTPS + Mutual Auth (Zero Plaintext)
                                        v
+-----------------------------------------------------------------------------------+
|                           BACKEND (NestJS + PostgreSQL)                           |
|                                                                                   |
|  [ Sync Gateway /api/v1/sync/delta ]                                              |
|  - Validates JWT & Rate Limits                                                    |
|  - Verifies Cryptographic Checksum SHA-256(ciphertext + iv + authTag)             |
|  - Resolves Version Conflicts                                                     |
|  - Never Receives Plaintext or Master Key Material                                |
|                                   |                                               |
|  [ PostgreSQL 16 (JSONB Encrypted Blobs) ]                                        |
|  [ Tamper-Evident SHA-256 Hash Chained Audit Log (HIPAA 45 CFR § 164.312(b)) ]    |
+-----------------------------------------------------------------------------------+
```

### Zero-Knowledge Guarantees
1. **The Server Cannot Decrypt**: The NestJS API and PostgreSQL database only store opaque base64-encoded ciphertexts (`ciphertext`), initialization vectors (`iv`), and authentication tags (`authTag`). Even in the event of a full server database breach, patient records cannot be decrypted.
2. **Deterministic Salt Provisioning**: The server stores a user-specific 32-byte salt and the required PBKDF2 iteration count. The master encryption key itself never leaves the client's volatile memory.
3. **Volatile Key Material Scrubbing**: When the mobile application is backgrounded or left inactive for >120 seconds, the master key is purged from JavaScript memory, requiring biometric (FaceID/TouchID) or PIN re-authentication.

---

## 2. Cryptographic Specifications

| Parameter | Specification | Standard / Reference |
| :--- | :--- | :--- |
| **Symmetric Cipher** | AES-GCM 256-bit | NIST SP 800-38D |
| **Key Derivation Function** | PBKDF2-HMAC-SHA256 | RFC 8018 / OWASP 2024 |
| **PBKDF2 Iterations** | 600,000 iterations | Exceeds OWASP minimum (310,000) |
| **Initialization Vector (IV)** | 96-bit (12 bytes) cryptographically random | Unique per encryption operation |
| **Authentication Tag** | 128-bit (16 bytes) GCM auth tag | Guarantees ciphertext integrity |
| **Key Fingerprint** | SHA-256 hash of raw master key (first 32 hex chars) | Detects key drift or rotation |
| **Payload Integrity** | SHA-256 hash of `ciphertext \| iv \| authTag` | Validated by backend prior to write |
| **Audit Log Integrity** | Blockchain-style SHA-256 hash chain | HIPAA 45 CFR § 164.312(b) |

---

## 3. Offline-First Delta Synchronization Protocol

The synchronization protocol is designed for intermittent cellular connectivity (airplanes, hospitals, rural clinics).

### Protocol Workflow
1. **Local Mutation**: When a user records vitals or adds a prescription offline, the record is immediately encrypted and written to local SQLite with `pending_sync = 1`.
2. **Network Listener**: Capacitor's `@capacitor/network` listens for `networkStatusChange`. When connectivity is detected, an automatic synchronization is scheduled.
3. **Delta Push & Pull (`POST /api/v1/sync/delta`)**:
   - The client sends `{ lastSyncTimestamp, mutations: [...] }`.
   - The backend runs a PostgreSQL transaction:
     - Applies mutations.
     - Detects version conflicts (`server.version > client.version`).
     - Queries all records where `serverUpdatedAt > lastSyncTimestamp`.
     - Returns `{ acceptedIds, conflicts, serverUpdates, syncTimestamp }`.
   - The client updates local SQLite: resets `pending_sync = 0` for accepted IDs and inserts `serverUpdates`.
4. **Soft-Delete Tombstoning**: Deleting a record generates an encrypted tombstone (`isDeleted = true`) with an incremented version, ensuring deletions cleanly propagate across all user devices.

---

## 4. Repository Structure

```
├── /backend                    # NestJS + PostgreSQL API
│   ├── src/
│   │   ├── main.ts             # Bootstrap with Helmet, CORS & Validation
│   │   ├── app.module.ts       # Root module with TypeORM & Throttler
│   │   ├── modules/
│   │   │   ├── auth/           # Argon2id authentication & key salt metadata
│   │   │   │   ├── entities/user.entity.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.controller.ts
│   │   │   ├── records/        # Encrypted record storage & querying
│   │   │   │   ├── entities/encrypted-record.entity.ts
│   │   │   │   ├── records.service.ts
│   │   │   │   └── records.controller.ts
│   │   │   ├── sync/           # Atomic bidirectional delta sync gateway
│   │   │   │   ├── sync.service.ts
│   │   │   │   ├── sync.controller.ts
│   │   │   │   └── dto/sync.dto.ts
│   │   │   └── audit/          # Tamper-evident hash-chained audit logging
│   │   │       ├── entities/audit-log.entity.ts
│   │   │       └── audit.service.ts
│   │   └── database/           # Migrations & data-source config
│   ├── Dockerfile              # Multi-stage production container
│   ├── docker-compose.yml      # PostgreSQL 16 + NestJS services
│   └── package.json
│
├── /frontend                   # Angular 18 + Capacitor 6 Mobile App
│   ├── capacitor.config.ts     # Native iOS/Android plugins & encryption config
│   ├── angular.json            # Angular CLI project definition
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/     # Plaintext & Encrypted wire models
│   │   │   │   └── services/
│   │   │   │       ├── crypto.service.ts          # WebCrypto AES-GCM + PBKDF2
│   │   │   │       ├── offline-storage.service.ts # Capacitor SQLite + IndexedDB
│   │   │   │       ├── sync.service.ts            # Delta sync & network monitor
│   │   │   │       ├── biometric-auth.service.ts  # FaceID / PIN & auto-lock
│   │   │   │       └── medical-records.service.ts # Record CRUD orchestration
│   │   │   └── features/
│   │   │       ├── records/    # Vitals, Labs, Prescriptions, Timeline
│   │   │       └── security/   # Key manager & recovery phrase export
│   │   └── main.ts
│   └── package.json
│
├── /src                        # Interactive Live Simulator & Refero Frame Showcase
│   ├── App.tsx                 # Refero device frame, WebCrypto engine & Code Explorer
│   ├── components/             # Frame toggles, cipher inspector, offline simulator
│   └── main.tsx
└── README.md                   # This comprehensive engineering manual
```

---

## 5. Backend Setup & Run Guide

### Option A: Running with Docker Compose (Recommended)

1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Start the database and API services:
   ```bash
   docker compose up -d
   ```
3. Verify health status:
   ```bash
   docker compose ps
   curl http://localhost:4000/api/v1/health
   ```

### Option B: Local Development

1. Ensure PostgreSQL 16 is running locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=vaultmed_admin
   DB_PASSWORD=secure_dev_password_change_in_prod
   DB_NAME=vaultmed_db
   JWT_SECRET=vaultmed_super_secret_jwt_key_at_least_32_chars_long!
   CORS_ORIGIN=http://localhost:4200,capacitor://localhost,http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

---

## 6. Frontend & Mobile Setup Guide

### Running Angular Web Development Server

1. Navigate to `/frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Launch the Angular dev server:
   ```bash
   npm run start
   ```
   Open `http://localhost:4200` in your browser.

### Building for iOS & Android with Capacitor

1. Build the production Angular bundle:
   ```bash
   npm run build
   ```
2. Synchronize with Capacitor native projects:
   ```bash
   npx cap sync
   ```
3. Launch native IDEs:
   - **iOS (Xcode)**:
     ```bash
     npx cap open ios
     ```
     *Requires macOS with Xcode 15+ installed. Ensure `NSFaceIDUsageDescription` is in `Info.plist`.*
   - **Android (Android Studio)**:
     ```bash
     npx cap open android
     ```
     *Requires Android Studio with SDK API 34+. BiometricPrompt permission is pre-configured.*

---

## 7. Security & Compliance Checklist

- [x] **Zero-Knowledge**: Private keys never transmitted to or held on the server.
- [x] **OWASP 2024 PBKDF2**: 600,000 iterations of HMAC-SHA256.
- [x] **AEAD Verification**: AES-GCM 128-bit authentication tag verified on every decryption.
- [x] **HIPAA Audit Log (§ 164.312(b))**: Tamper-evident hash-chained logging of all PHI sync events.
- [x] **Automatic Screen Lock**: Session keys wiped from memory on mobile backgrounding.
- [x] **Hardware Keystore Integration**: Capacitor SQLite configured with hardware-backed encryption flags (`iosIsEncryption`, `androidIsEncryption`).
- [x] **Emergency ICE Protocol**: Read-only critical profile (blood type, severe allergies) accessible with fast confirmation during emergencies.
