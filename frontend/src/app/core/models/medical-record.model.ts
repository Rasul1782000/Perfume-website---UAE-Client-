export type MedicalRecordType =
  | 'vital_signs'
  | 'lab_result'
  | 'prescription'
  | 'clinical_note'
  | 'immunization'
  | 'allergy'
  | 'emergency_ice';

export interface VitalSignsPayload {
  systolicBp: number; // mmHg
  diastolicBp: number; // mmHg
  heartRate: number; // bpm
  spO2: number; // percentage
  respiratoryRate?: number;
  temperature?: number; // celsius
  bloodGlucose?: number; // mg/dL
  notes?: string;
}

export interface LabResultPayload {
  testName: string;
  category: 'Metabolic' | 'Lipid' | 'Hematology' | 'Endocrine' | 'Genomic' | 'Urinalysis';
  results: Array<{
    analyte: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    flag?: 'normal' | 'high' | 'low' | 'critical';
  }>;
  orderingPhysician: string;
  laboratory: string;
  specimenDate: string;
  interpretation?: string;
}

export interface PrescriptionPayload {
  medicationName: string;
  dosage: string;
  route: 'Oral' | 'Subcutaneous' | 'Inhalation' | 'Intravenous' | 'Topical';
  frequency: string;
  prescribingDoctor: string;
  indication: string;
  startDate: string;
  endDate?: string;
  refillsRemaining: number;
  pharmacy: string;
  warnings?: string[];
}

export interface ClinicalNotePayload {
  title: string;
  specialty: 'Cardiology' | 'Neurology' | 'Endocrinology' | 'Primary Care' | 'Oncology' | 'Orthopedics';
  providerName: string;
  facility: string;
  encounterDate: string;
  chiefComplaint: string;
  assessmentAndPlan: string;
  followUpDate?: string;
}

export interface EmergencyIcePayload {
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  chronicConditions: string[];
  primaryEmergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  organDonor: boolean;
  dnrStatus: boolean;
  notesForFirstResponders: string;
}

export type PlaintextMedicalData =
  | { type: 'vital_signs'; data: VitalSignsPayload }
  | { type: 'lab_result'; data: LabResultPayload }
  | { type: 'prescription'; data: PrescriptionPayload }
  | { type: 'clinical_note'; data: ClinicalNotePayload }
  | { type: 'emergency_ice'; data: EmergencyIcePayload };

/**
 * Local Decrypted Record (stored in device secure volatile memory).
 */
export interface LocalMedicalRecord {
  id: string;
  recordType: MedicalRecordType;
  title: string;
  summary: string;
  payload: PlaintextMedicalData;
  clientCreatedAt: string;
  clientUpdatedAt: string;
  version: number;
  isDeleted: boolean;
  pendingSync: boolean;
  lastSyncedAt?: string;
  keyFingerprint: string;
}

/**
 * Encrypted Wire Payload (sent to NestJS backend & stored in PostgreSQL).
 * ZERO plaintext ever leaves the client device.
 */
export interface EncryptedRecordPayload {
  id: string;
  recordType: MedicalRecordType;
  ciphertext: string; // Base64 AES-256-GCM
  iv: string; // Base64 12-byte IV
  authTag: string; // Base64 16-byte Auth Tag
  keyFingerprint: string; // SHA-256
  version: number;
  isDeleted: boolean;
  clientCreatedAt: string;
  clientUpdatedAt: string;
  checksum: string; // SHA-256(ciphertext + iv + authTag)
}
