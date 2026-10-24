import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Key, Terminal, AlertCircle, RefreshCw, CheckCircle2, Copy, Sparkles } from 'lucide-react';
import { cryptoEngine } from '../services/cryptoEngine';

export const CryptoStudio: React.FC = () => {
  const [passphrase, setPassphrase] = useState('PatientMedicalVault2026!');
  const [iterations, setIterations] = useState(600000);
  const [plaintextInput, setPlaintextInput] = useState(
    JSON.stringify(
      {
        patientId: 'PT-99482',
        diagnosis: 'Stage 1 Essential Hypertension',
        medication: 'Lisinopril 10mg PO Daily',
        confidentialNote: 'Patient reports mild morning dizziness. Titration planned.',
      },
      null,
      2
    )
  );

  const [encryptionResult, setEncryptionResult] = useState<{
    ciphertext: string;
    iv: string;
    authTag: string;
    keyFingerprint: string;
    checksum: string;
  } | null>(null);

  const [tamperedCiphertext, setTamperedCiphertext] = useState('');
  const [decryptionResult, setDecryptionResult] = useState<string | null>(null);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Run Live WebCrypto AES-GCM 256
  const handleEncrypt = async () => {
    setIsProcessing(true);
    setDecryptionResult(null);
    setDecryptionError(null);

    try {
      const parsed = JSON.parse(plaintextInput);
      const res = await cryptoEngine.encryptObject(parsed);
      setEncryptionResult(res);
      setTamperedCiphertext(res.ciphertext);
    } catch (err: any) {
      setDecryptionError(`Encryption error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Run Authenticated Decryption
  const handleDecrypt = async (useTampered = false) => {
    if (!encryptionResult) return;
    setIsProcessing(true);
    setDecryptionError(null);
    setDecryptionResult(null);

    try {
      const textToDecrypt = useTampered ? tamperedCiphertext : encryptionResult.ciphertext;
      const decrypted = await cryptoEngine.decryptObject(
        textToDecrypt,
        encryptionResult.iv,
        encryptionResult.authTag
      );
      setDecryptionResult(JSON.stringify(decrypted, null, 2));
    } catch (err: any) {
      setDecryptionError(
        `WebCrypto AEAD Tag Verification Failed: ${err.message}. Ciphertext or AuthTag was modified in transit!`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Tamper with one character
  const handleSimulateTampering = () => {
    if (!encryptionResult) return;
    const original = encryptionResult.ciphertext;
    // Mutate the 10th character
    const char = original.charAt(10) === 'A' ? 'B' : 'A';
    const tampered = original.substring(0, 10) + char + original.substring(11);
    setTamperedCiphertext(tampered);
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-5xl mx-auto space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              WebCrypto AES-256-GCM & PBKDF2 Interactive Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real browser-native cryptography execution. Verify zero-knowledge payload construction and AEAD tag integrity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
          <Key className="w-3.5 h-3.5" />
          <span>FINGERPRINT: {cryptoEngine.getKeyFingerprint().slice(0, 16)}...</span>
        </div>
      </div>

      {/* Grid: Inputs & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Key Derivation & Input */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              1. Key Derivation (PBKDF2-HMAC-SHA256)
            </h3>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">User Passphrase (never leaves phone)</label>
              <input
                type="text"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Iterations (Rounds)</label>
                <input
                  type="number"
                  value={iterations}
                  disabled
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Salt (32-byte hex)</label>
                <input
                  type="text"
                  value={cryptoEngine.getSaltHex().slice(0, 16) + '...'}
                  disabled
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Plaintext Input */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                2. Plaintext Medical JSON (Client Only)
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">Protected Health Info</span>
            </div>

            <textarea
              rows={8}
              value={plaintextInput}
              onChange={(e) => setPlaintextInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-emerald-300 font-mono leading-relaxed focus:border-emerald-500"
            />

            <button
              onClick={handleEncrypt}
              disabled={isProcessing}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Execute WebCrypto AES-GCM 256 Encryption</span>
            </button>
          </div>
        </div>

        {/* Right: Encrypted Wire Output & Decryption Test */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                3. Wire Payload (NestJS / Postgres View)
              </h3>
              <span className="text-[10px] text-purple-400 font-mono">Zero Plaintext</span>
            </div>

            {encryptionResult ? (
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-2.5 bg-black rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Ciphertext (Base64)</span>
                  <p className="text-emerald-400 break-all select-all text-[11px] leading-tight">
                    {encryptionResult.ciphertext}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-black rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">IV (12-byte random)</span>
                    <p className="text-cyan-400 text-[11px] font-bold">{encryptionResult.iv}</p>
                  </div>
                  <div className="p-2 bg-black rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Auth Tag (128-bit)</span>
                    <p className="text-purple-400 text-[11px] font-bold">{encryptionResult.authTag}</p>
                  </div>
                </div>

                <div className="p-2 bg-black rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block mb-0.5">SHA-256 Checksum</span>
                  <p className="text-slate-400 text-[10px] truncate">{encryptionResult.checksum}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                Click "Execute WebCrypto AES-GCM 256 Encryption" to produce live encrypted payload
              </div>
            )}
          </div>

          {/* Tamper Resistance Test */}
          {encryptionResult && (
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                <Unlock className="w-4 h-4 text-cyan-400" />
                4. Decryption & Tamper-Proofing Verification
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDecrypt(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Decrypt Valid Payload</span>
                </button>
                <button
                  onClick={() => {
                    handleSimulateTampering();
                    handleDecrypt(true);
                  }}
                  className="flex-1 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-rose-800/60"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Tamper with 1 Byte</span>
                </button>
              </div>

              {/* Decryption Success */}
              {decryptionResult && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    DECRYPTION VERIFIED: AUTH TAG MATCHED
                  </span>
                  <pre className="text-[10px] text-emerald-200 font-mono overflow-x-auto p-1 bg-black/40 rounded">
                    {decryptionResult}
                  </pre>
                </div>
              )}

              {/* Decryption Error (Tamper Detected) */}
              {decryptionError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    TAMPERING DETECTED BY WEBCRYPTO
                  </span>
                  <p className="text-[11px] text-rose-200 leading-snug">{decryptionError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
