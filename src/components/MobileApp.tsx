import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Activity,
  FileText,
  Pill,
  HeartPulse,
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff,
  Fingerprint,
  Sparkles,
  Copy,
  Check,
  X,
  Database,
  ArrowDownUp,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { MedicalRecordItem, MedicalRecordType, AuditLogItem } from '../types/medical';
import { INITIAL_RECORDS } from '../data/initialRecords';
import { cryptoEngine } from '../services/cryptoEngine';

interface MobileAppProps {
  onInspectRecordCipher?: (rec: MedicalRecordItem) => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({ onInspectRecordCipher }) => {
  // Application State
  const [isLocked, setIsLocked] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [isBiometricPrompting, setIsBiometricPrompting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'emergency' | 'security' | 'sync'>('records');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MedicalRecordType>('all');
  const [records, setRecords] = useState<MedicalRecordItem[]>(INITIAL_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordItem | null>(null);
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [showWireDetails, setShowWireDetails] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [revealedMnemonic, setRevealedMnemonic] = useState(false);

  // New Record Form State
  const [newCategory, setNewCategory] = useState<MedicalRecordType>('vital_signs');
  const [newTitle, setNewTitle] = useState('');
  const [newSystolic, setNewSystolic] = useState('120');
  const [newDiastolic, setNewDiastolic] = useState('80');
  const [newHeartRate, setNewHeartRate] = useState('72');
  const [newBloodGlucose, setNewBloodGlucose] = useState('95');
  const [newNotes, setNewNotes] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFrequency, setNewMedFrequency] = useState('Once daily');

  // Audit Logs (tamper-evident)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-101',
      action: 'KEY_DERIVATION_PBKDF2',
      timestamp: 'Today, 08:30:12',
      details: 'Derived 256-bit AES-GCM Master Key (600,000 iterations)',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      entryHash: '7b82f019c4819d02e81745610293847561029384756102938475610293847561',
    },
    {
      id: 'log-102',
      action: 'SYNC_DELTA_PULL',
      timestamp: 'Today, 08:30:15',
      details: 'Sync with NestJS: 0 conflicts, 5 active records loaded',
      previousHash: '7b82f019c4819d02e81745610293847561029384756102938475610293847561',
      entryHash: 'c4819d02e817456102938475610293847561029384756102938475617b82f019',
    },
  ]);

  // Handle Biometric Unlock
  const handleBiometricUnlock = () => {
    setIsBiometricPrompting(true);
    setTimeout(() => {
      setIsBiometricPrompting(false);
      setIsLocked(false);
      setPinCode('');
    }, 700);
  };

  // Handle PIN input
  const handlePinPress = (digit: string) => {
    if (pinCode.length < 4) {
      const nextPin = pinCode + digit;
      setPinCode(nextPin);
      if (nextPin === '1234') {
        setTimeout(() => {
          setIsLocked(false);
          setPinCode('');
        }, 200);
      }
    }
  };

  // Perform Delta Sync with NestJS endpoint simulation
  const handleTriggerSync = () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);

    setTimeout(() => {
      // Mark pending records as synced
      setRecords((prev) =>
        prev.map((r) => ({
          ...r,
          pendingSync: false,
        }))
      );

      // Append audit log
      const pendingCount = records.filter((r) => r.pendingSync).length;
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        action: 'SYNC_DELTA_PUSH',
        timestamp: 'Just now',
        details: `Pushed ${pendingCount} delta records to NestJS PostgreSQL gateway. Zero conflicts.`,
        previousHash: auditLogs[auditLogs.length - 1]?.entryHash || 'GENESIS',
        entryHash: 'a891029384756102938475610293847561029384756102938475610293847561',
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      setIsSyncing(false);
    }, 1100);
  };

  // Create new Encrypted Record via WebCrypto
  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    let plaintextPayload: any;
    let summaryText = '';
    let recordTitle = newTitle || 'Medical Log';

    if (newCategory === 'vital_signs') {
      recordTitle = recordTitle || 'Cardiovascular Vitals';
      summaryText = `BP ${newSystolic}/${newDiastolic} mmHg · HR ${newHeartRate} bpm`;
      plaintextPayload = {
        type: 'vital_signs',
        data: {
          systolicBp: parseInt(newSystolic, 10),
          diastolicBp: parseInt(newDiastolic, 10),
          heartRate: parseInt(newHeartRate, 10),
          spO2: 99,
          bloodGlucose: parseInt(newBloodGlucose, 10),
          notes: newNotes,
        },
      };
    } else if (newCategory === 'prescription') {
      recordTitle = newTitle || newMedName || 'Prescription';
      summaryText = `${newMedDosage || 'Standard dose'} · ${newMedFrequency}`;
      plaintextPayload = {
        type: 'prescription',
        data: {
          medicationName: newMedName || 'Medication',
          dosage: newMedDosage || '20 mg',
          route: 'Oral',
          frequency: newMedFrequency,
          prescribingDoctor: 'Attending Physician',
          indication: 'Preventive treatment',
          startDate: new Date().toISOString().split('T')[0],
          refillsRemaining: 2,
          pharmacy: 'Primary Hospital Pharmacy',
        },
      };
    } else {
      recordTitle = newTitle || 'Clinical Observation';
      summaryText = newNotes.slice(0, 45) || 'Clinical record entered on device';
      plaintextPayload = {
        type: 'clinical_note',
        data: {
          title: recordTitle,
          specialty: 'Primary Care',
          providerName: 'Attending Physician',
          facility: 'Ambulatory Care Center',
          encounterDate: new Date().toISOString().split('T')[0],
          chiefComplaint: 'Patient entry',
          assessmentAndPlan: newNotes || 'Routine observation.',
        },
      };
    }

    // Live WebCrypto AES-GCM-256 Encryption
    const encrypted = await cryptoEngine.encryptObject(plaintextPayload);

    const newRecordItem: MedicalRecordItem = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      recordType: newCategory,
      title: recordTitle,
      summary: summaryText,
      date: 'Just now',
      payload: plaintextPayload,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      keyFingerprint: encrypted.keyFingerprint,
      checksum: encrypted.checksum,
      version: 1,
      pendingSync: true, // Marked for offline sync
      isDeleted: false,
    };

    setRecords((prev) => [newRecordItem, ...prev]);

    // Append to tamper-evident audit trail
    const newAudit: AuditLogItem = {
      id: `log-${Date.now()}`,
      action: 'RECORD_ENCRYPT_CREATE',
      timestamp: 'Just now',
      details: `Created E2EE record [${newCategory}]. AES-256-GCM IV: ${encrypted.iv.slice(0, 8)}...`,
      previousHash: auditLogs[0]?.entryHash || '000000',
      entryHash: encrypted.checksum,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    // Reset Form
    setIsCreatingRecord(false);
    setNewTitle('');
    setNewNotes('');

    // If online, auto sync
    if (isOnline) {
      setTimeout(() => {
        setRecords((prev) =>
          prev.map((r) => (r.id === newRecordItem.id ? { ...r, pendingSync: false } : r))
        );
      }, 900);
    }
  };

  const pendingCount = records.filter((r) => r.pendingSync).length;
  const filteredRecords = records.filter((r) => {
    if (categoryFilter === 'all') return true;
    return r.recordType === categoryFilter;
  });

  // Emergency ICE Data
  const iceRecord = records.find((r) => r.recordType === 'emergency_ice');

  // --- LOCK SCREEN VIEW ---
  if (isLocked) {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-950 text-white select-none">
        {/* Lock Screen Header */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 shadow-lg shadow-black/60">
            <Lock className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">VaultMed Locked</h2>
          <p className="text-xs text-slate-400 mt-1">Zero-Knowledge Encrypted Healthcare Store</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AES-256-GCM Secure Memory</span>
          </div>
        </div>

        {/* Biometric Prompt or PIN */}
        <div className="flex flex-col items-center my-auto">
          {/* PIN Dots */}
          <div className="flex gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border border-slate-600 transition-all ${
                  pinCode.length > i ? 'bg-emerald-400 border-emerald-400 scale-110' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-64 max-w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handlePinPress(digit)}
                className="h-14 rounded-full bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-lg font-semibold flex items-center justify-center transition-all border border-slate-800/60"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('emergency')}
              className="h-14 rounded-full text-xs text-rose-400 font-semibold flex flex-col items-center justify-center hover:bg-rose-950/30 transition-all"
            >
              <HeartPulse className="w-4 h-4 mb-0.5" />
              <span>ICE</span>
            </button>
            <button
              onClick={() => handlePinPress('0')}
              className="h-14 rounded-full bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-lg font-semibold flex items-center justify-center transition-all border border-slate-800/60"
            >
              0
            </button>
            <button
              onClick={handleBiometricUnlock}
              disabled={isBiometricPrompting}
              className="h-14 rounded-full text-emerald-400 font-semibold flex flex-col items-center justify-center hover:bg-emerald-950/30 transition-all"
            >
              <Fingerprint className={`w-5 h-5 ${isBiometricPrompting ? 'animate-pulse text-emerald-300' : ''}`} />
              <span className="text-[10px] mt-0.5">FaceID</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 font-mono">Demo PIN: 1234 or tap FaceID</p>
        </div>

        {/* Emergency First Responder Access Button */}
        <button
          onClick={() => {
            setIsLocked(false);
            setActiveTab('emergency');
          }}
          className="w-full py-3 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-rose-800/50 transition-all"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Emergency Medical ID (First Responder Access)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#090d14] text-slate-100 select-none overflow-hidden">
      {/* Top Mobile App Bar */}
      <div className="px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">VaultMed</h1>
            <p className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">E2EE Medical Store</p>
          </div>
        </div>

        {/* Offline / Online Simulation Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnline(!isOnline)}
            title={isOnline ? 'Switch to Offline (Airplane Mode)' : 'Switch to Online'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline</span>
              </>
            )}
          </button>

          {/* Quick Lock Button */}
          <button
            onClick={() => setIsLocked(true)}
            title="Lock Medical Vault"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {pendingCount > 0 ? (
            <span className="text-amber-400 font-medium">
              {pendingCount} record{pendingCount > 1 ? 's' : ''} pending sync (offline queue)
            </span>
          ) : (
            <span className="text-slate-400">Local store synchronized with NestJS</span>
          )}
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={!isOnline || isSyncing || pendingCount === 0}
          className={`flex items-center gap-1 font-semibold ${
            isOnline && pendingCount > 0
              ? 'text-emerald-400 hover:text-emerald-300'
              : 'text-slate-600 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>

      {/* MAIN VIEW CONTENT */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {/* --- RECORDS TAB --- */}
        {activeTab === 'records' && (
          <>
            {/* Category Filter Horizontal Segment */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All Records' },
                  { id: 'vital_signs', label: 'Vitals' },
                  { id: 'lab_result', label: 'Lab Tests' },
                  { id: 'prescription', label: 'Prescriptions' },
                  { id: 'clinical_note', label: 'Notes' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    categoryFilter === cat.id
                      ? 'bg-slate-200 text-slate-900 font-semibold'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Action: New Encrypted Record */}
            <button
              onClick={() => setIsCreatingRecord(true)}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Record New Encrypted Health Entry</span>
            </button>

            {/* Records List Feed */}
            <div className="space-y-2.5">
              {filteredRecords.map((item) => {
                const getIcon = () => {
                  switch (item.recordType) {
                    case 'vital_signs':
                      return <HeartPulse className="w-4 h-4 text-rose-400" />;
                    case 'lab_result':
                      return <Activity className="w-4 h-4 text-blue-400" />;
                    case 'prescription':
                      return <Pill className="w-4 h-4 text-emerald-400" />;
                    case 'clinical_note':
                      return <FileText className="w-4 h-4 text-purple-400" />;
                    case 'emergency_ice':
                      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
                    default:
                      return <Shield className="w-4 h-4 text-slate-400" />;
                  }
                };

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className="p-3 bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 rounded-xl transition-all cursor-pointer active:scale-[0.99] group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 mt-0.5">
                          {getIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                            {item.pendingSync && (
                              <span className="text-[9px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800/50 shrink-0">
                                OFFLINE QUEUE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.summary}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono">
                            <span>{item.date}</span>
                            <span>·</span>
                            <span>v{item.version}</span>
                            <span>·</span>
                            <span className="text-emerald-500">AES-256-GCM</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 shrink-0 self-center" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* --- EMERGENCY ICE TAB --- */}
        {activeTab === 'emergency' && iceRecord && (
          <div className="space-y-3">
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Emergency Medical ID (ICE)</h3>
              </div>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                Critical medical profile intended for paramedics and emergency physicians. Accessible during acute trauma
                without master passphrase.
              </p>
            </div>

            {/* Critical Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Blood Type</span>
                <p className="text-xl font-bold text-rose-400 mt-0.5">{(iceRecord.payload as any).data.bloodType}</p>
                <span className="text-[10px] text-slate-400">Universal RBC donor</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Organ Donor</span>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">Yes</p>
                <span className="text-[10px] text-slate-400">Registered state donor</span>
              </div>
            </div>

            {/* Allergies Alert Box */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                Severe Allergic Reactions
              </span>
              <ul className="space-y-1 text-xs text-slate-200 font-medium">
                {(iceRecord.payload as any).data.allergies.map((allergy: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{allergy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Contact */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Primary Healthcare Proxy
              </span>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{(iceRecord.payload as any).data.emergencyContact.name}</h4>
                  <p className="text-[11px] text-slate-400">{(iceRecord.payload as any).data.emergencyContact.relationship}</p>
                </div>
                <a
                  href={`tel:${(iceRecord.payload as any).data.emergencyContact.phone}`}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                >
                  Call
                </a>
              </div>
            </div>

            {/* Clinical Instructions */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-300">
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">First Responder Directives</span>
              <p className="italic text-[11px]">{(iceRecord.payload as any).data.notes}</p>
            </div>
          </div>
        )}

        {/* --- SECURITY & KEY MANAGEMENT TAB --- */}
        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white">Client Master Key Specification</h3>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                  ZERO-KNOWLEDGE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Derived directly on your phone using PBKDF2-HMAC-SHA256 with 600,000 rounds. The NestJS backend and
                PostgreSQL database never receive this key.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Cipher Protocol</span>
                  <span className="font-mono text-emerald-400 font-semibold">AES-GCM-256</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">PBKDF2 Iterations</span>
                  <span className="font-mono text-slate-200">600,000 rounds</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Key Fingerprint</span>
                  <span className="font-mono text-slate-300">{cryptoEngine.getKeyFingerprint().slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between items-center py-1 text-[11px]">
                  <span className="text-slate-400">Volatile Memory Auto-Lock</span>
                  <span className="font-mono text-emerald-400">120s inactivity / background</span>
                </div>
              </div>
            </div>

            {/* 12-Word Recovery Mnemonic */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">12-Word Recovery Seed Phrase</h4>
                </div>
                <button
                  onClick={() => setRevealedMnemonic(!revealedMnemonic)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {revealedMnemonic ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{revealedMnemonic ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Used to restore access to your encrypted medical vault on a new phone without server involvement.
              </p>

              <div className="p-2.5 bg-black/60 rounded-lg border border-slate-800 font-mono text-[11px] grid grid-cols-3 gap-2">
                {[
                  'apple', 'timber', 'vault', 'cardiac', 'pulse', 'orbit',
                  'secure', 'shield', 'neuron', 'oxygen', 'clinic', 'echo'
                ].map((word, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-slate-400">
                    <span className="text-slate-600 text-[9px]">{idx + 1}.</span>
                    <span className={revealedMnemonic ? 'text-slate-200' : 'blur-[3px] select-none text-slate-400'}>
                      {word}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tamper-Evident HIPAA Audit Log Feed */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Tamper-Evident Audit Trail
                </h4>
                <span className="text-[9px] font-mono text-purple-400 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/40">
                  HIPAA § 164.312(b)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">
                Every sync and crypto event is cryptographically hash-chained (SHA-256).
              </p>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
                    <div className="flex justify-between items-center text-slate-300 font-semibold mb-0.5">
                      <span className="font-mono text-emerald-400">{log.action}</span>
                      <span className="text-slate-500 font-mono text-[9px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">{log.details}</p>
                    <div className="mt-1 font-mono text-[8px] text-slate-600 truncate">
                      Chain Hash: {log.entryHash.slice(0, 24)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SYNC & PROTOCOL TAB --- */}
        {activeTab === 'sync' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white">Delta Sync Gateway</h3>
                </div>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                    isOnline ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {isOnline ? 'ESTABLISHED' : 'OFFLINE STORE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Bi-directional synchronization pushes local SQLite delta mutations to NestJS and pulls newer server
                records without leaking plaintext.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Backend Endpoint</span>
                  <span className="font-mono text-slate-200">/api/v1/sync/delta</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Offline Queue</span>
                  <span className="font-mono text-amber-400 font-semibold">{pendingCount} record{pendingCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Local Database</span>
                  <span className="font-mono text-slate-200">Capacitor SQLite (Encrypted)</span>
                </div>
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-slate-400">Remote Database</span>
                  <span className="font-mono text-slate-200">PostgreSQL 16 (JSONB Blobs)</span>
                </div>
              </div>

              <button
                onClick={handleTriggerSync}
                disabled={!isOnline || isSyncing}
                className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Flushing Delta Queue...' : 'Force Immediate Sync Now'}</span>
              </button>
            </div>

            {/* Offline Test Walkthrough Guide */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                How to Test Offline Capabilities:
              </h4>
              <ol className="list-decimal pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Tap the <strong className="text-emerald-400">Online/Offline</strong> toggle at the top bar to simulate entering airplane mode.</li>
                <li>Tap <strong className="text-slate-200">+ Record New Encrypted Health Entry</strong> to add a vital or note.</li>
                <li>Notice it saves instantly to local SQLite with the <strong className="text-amber-400 font-mono">OFFLINE QUEUE</strong> badge.</li>
                <li>Toggle back to <strong className="text-emerald-400">Online</strong> and tap <strong className="text-emerald-400">Sync</strong> to watch the delta flush to NestJS!</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM TAB BAR NAVIGATION (Thumb zone navigation) */}
      <div className="h-14 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-2 grid grid-cols-4 items-center shrink-0">
        <button
          onClick={() => setActiveTab('records')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'records' ? 'text-emerald-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] mt-1">Records</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'emergency' ? 'text-rose-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="text-[10px] mt-1">ICE Card</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'sync' ? 'text-emerald-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ArrowDownUp className="w-4 h-4" />
          <span className="text-[10px] mt-1">Sync</span>
          {pendingCount > 0 && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'security' ? 'text-emerald-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Key className="w-4 h-4" />
          <span className="text-[10px] mt-1">Vault Key</span>
        </button>
      </div>

      {/* --- RECORD DETAIL DRAWER / MODAL --- */}
      {selectedRecord && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end p-2 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 max-h-[85%] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white truncate max-w-[200px]">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setShowWireDetails(false);
                }}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle: Decrypted vs Encrypted Wire */}
            <div className="flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setShowWireDetails(false)}
                className={`flex-1 py-1 rounded-md font-medium transition-all ${
                  !showWireDetails ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                Decrypted Clinical View
              </button>
              <button
                onClick={() => setShowWireDetails(true)}
                className={`flex-1 py-1 rounded-md font-medium transition-all ${
                  showWireDetails ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400'
                }`}
              >
                E2EE Wire Payload (Server View)
              </button>
            </div>

            {/* DECRYPTED VIEW */}
            {!showWireDetails ? (
              <div className="space-y-2.5 text-xs">
                {selectedRecord.recordType === 'vital_signs' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono">Blood Pressure</span>
                      <p className="text-base font-bold text-white">
                        {(selectedRecord.payload as any).data.systolicBp}/{(selectedRecord.payload as any).data.diastolicBp} mmHg
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono">Heart Rate</span>
                      <p className="text-base font-bold text-emerald-400">
                        {(selectedRecord.payload as any).data.heartRate} bpm
                      </p>
                    </div>
                  </div>
                )}

                {selectedRecord.recordType === 'lab_result' && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">Analyte Findings</span>
                    {((selectedRecord.payload as any).data.results || []).map((res: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                        <span className="font-medium text-slate-300">{res.analyte}</span>
                        <span className="font-mono font-bold text-white">{res.value} {res.unit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedRecord.recordType === 'prescription' && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Medication</span>
                      <span className="font-bold text-emerald-400">{(selectedRecord.payload as any).data.medicationName}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Dosage & Route</span>
                      <span className="text-slate-200">{(selectedRecord.payload as any).data.dosage} · {(selectedRecord.payload as any).data.route}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Frequency</span>
                      <span className="text-slate-200">{(selectedRecord.payload as any).data.frequency}</span>
                    </div>
                  </div>
                )}

                {selectedRecord.recordType === 'clinical_note' && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Provider</span>
                      <span className="text-slate-200 font-medium">{(selectedRecord.payload as any).data.providerName}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                      {(selectedRecord.payload as any).data.assessmentAndPlan}
                    </p>
                  </div>
                )}

                <div className="p-2 bg-slate-950/60 rounded-lg text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Record ID: {selectedRecord.id}</span>
                  <span className="text-emerald-400">Decrypted Locally</span>
                </div>
              </div>
            ) : (
              /* ENCRYPTED WIRE PAYLOAD VIEW */
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-black rounded-lg border border-slate-800 font-mono text-[10px] space-y-1.5">
                  <div>
                    <span className="text-slate-500 block">CIPHERTEXT (AES-256-GCM Base64):</span>
                    <p className="text-emerald-400 break-all select-all">{selectedRecord.ciphertext}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 block">INITIALIZATION VECTOR (12 bytes Base64):</span>
                    <p className="text-cyan-400 font-semibold">{selectedRecord.iv}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 block">AUTH TAG (128-bit Base64):</span>
                    <p className="text-purple-400 font-semibold">{selectedRecord.authTag}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 block">INTEGRITY CHECKSUM (SHA-256):</span>
                    <p className="text-slate-400 truncate">{selectedRecord.checksum}</p>
                  </div>
                </div>

                <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-[10px] text-emerald-300">
                  Notice: The NestJS API and PostgreSQL only ever store these encrypted fields. Plaintext is mathematically impossible to reconstruct without the patient device key.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CREATE NEW ENCRYPTED RECORD MODAL --- */}
      {isCreatingRecord && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col justify-end p-2 animate-in fade-in">
          <form
            onSubmit={handleCreateRecord}
            className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 max-h-[90%] overflow-y-auto space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">Create Encrypted Medical Entry</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingRecord(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select Record Type */}
            <div>
              <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="vital_signs">Vital Signs (Blood Pressure, Heart Rate)</option>
                <option value="prescription">Prescription / Medication</option>
                <option value="clinical_note">Clinical Note / Observation</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Title / Label</label>
              <input
                type="text"
                placeholder="e.g. Evening Blood Pressure Check"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Dynamic Inputs based on Category */}
            {newCategory === 'vital_signs' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newSystolic}
                    onChange={(e) => setNewSystolic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newDiastolic}
                    onChange={(e) => setNewDiastolic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={newHeartRate}
                    onChange={(e) => setNewHeartRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={newBloodGlucose}
                    onChange={(e) => setNewBloodGlucose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}

            {newCategory === 'prescription' && (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Medication Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Metformin HCl"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 mg"
                      value={newMedDosage}
                      onChange={(e) => setNewMedDosage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Frequency</label>
                    <input
                      type="text"
                      placeholder="e.g. Twice daily with meals"
                      value={newMedFrequency}
                      onChange={(e) => setNewMedFrequency(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Clinical Observations / Notes */}
            <div>
              <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Clinical Notes</label>
              <textarea
                rows={2}
                placeholder="Optional notes or observations..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-hidden"
              />
            </div>

            {/* Cryptographic Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950 transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypt with AES-256-GCM & Save Offline</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
