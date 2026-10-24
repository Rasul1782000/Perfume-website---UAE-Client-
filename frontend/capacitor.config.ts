import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vaultmed.security.records',
  appName: 'VaultMed',
  webDir: 'dist/vaultmed-mobile/browser',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'ionic',
    cleartext: false,
    allowNavigation: [
      'https://api.vaultmed.security',
      'http://localhost:4000',
    ],
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'vaultmed_sqlite_',
      iosBiometric: {
        biometricAuth: true,
        biometricTitle: 'Biometric Authentication for Medical Vault',
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: true,
        biometricTitle: 'Biometric Authentication for Medical Vault',
        biometricSubTitle: 'Touch fingerprint sensor or look at camera',
        biometricDescription: 'Confirm biometric identity to decrypt local healthcare store',
      },
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    App: {
      autoHideSplashScreen: true,
    },
  },
};

export default config;
