import React, { useState } from 'react';
import { ArrowDownUp, Database, Smartphone, CheckCircle, RefreshCw, Server, Shield, FileCheck, Layers } from 'lucide-react';

export const SyncVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const steps = [
    {
      title: '1. Local Offline Mutation',
      component: 'Capacitor SQLite',
      desc: 'Patient records blood pressure or doctor note while in airplane mode. Stored in local hardware-encrypted SQLite table with pending_sync = 1.',
      icon: <Smartphone className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
    },
    {
      title: '2. Client-Side WebCrypto Envelope',
      component: 'WebCrypto Subtle API',
      desc: 'Payload is encrypted with AES-256-GCM using unique 12-byte IV. Generates 128-bit authentication tag and SHA-256 payload checksum.',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300',
    },
    {
      title: '3. Network Reconnect & Delta Dispatch',
      component: 'Capacitor Network Listener',
      desc: 'Cellular or Wi-Fi reconnects. Network listener fires and packages all pending mutations into a single atomic delta POST to /api/v1/sync/delta.',
      icon: <ArrowDownUp className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
    },
    {
      title: '4. NestJS Gateway & Atomic Postgres Commit',
      component: 'NestJS TypeORM QueryRunner',
      desc: 'Backend verifies cryptographic checksum, detects version conflicts (client.version vs server.version), updates serverUpdatedAt, and logs audit hash.',
      icon: <Server className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
    },
    {
      title: '5. Watermark Sync Acknowledgment',
      component: 'Sync Watermark Protocol',
      desc: 'Server responds with acceptedIds, serverUpdates, and syncTimestamp. Client resets pending_sync = 0 in local SQLite. State is 100% synchronized.',
      icon: <CheckCircle className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-500/50 bg-teal-950/20 text-teal-300',
    },
  ];

  const handleRunFullCycle = () => {
    setIsSimulating(true);
    setActiveStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= steps.length) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStep(current);
      }
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ArrowDownUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Offline-First Delta Synchronization Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Step-by-step visual trace of how encrypted medical records sync between Angular Capacitor and NestJS PostgreSQL.
          </p>
        </div>

        <button
          onClick={handleRunFullCycle}
          disabled={isSimulating}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Simulating Sync...' : 'Simulate Delta Sync Cycle'}</span>
        </button>
      </div>

      {/* Interactive Step Timeline */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === idx
                ? `${step.color} shadow-lg ring-1 ring-white/20`
                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 shrink-0 mt-0.5">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-slate-800">
                    {step.component}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Protocol Architecture Notes */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 text-xs">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Zero-Knowledge Conflict Resolution Architecture
        </h4>
        <p className="text-slate-400 leading-relaxed">
          Because the server cannot inspect plaintext values, conflict resolution uses a hybrid approach:
          <strong>Monotonic Versioning</strong> combined with <strong>Client-Assisted 3-Way Merge</strong>.
          If multiple offline devices modify the same record, both encrypted blobs are preserved on the client until
          the user confirms which version to keep.
        </p>
      </div>
    </div>
  );
};
