export type MedicalRecordType =
  | 'vital_signs'
  | 'lab_result'
  | 'prescription'
  | 'clinical_note'
  | 'immunization'
  | 'emergency_ice';

export interface VitalSignsData {
  systolicBp: number;
  diastolicBp: number;
  heartRate: number;
  spO2: number;
  bloodGlucose?: number;
  temperature?: number;
  notes?: string;
}

export interface LabResultData {
  testName: string;
  category: 'Metabolic' | 'Lipid' | 'Hematology' | 'Endocrine' | 'Genomic';
  orderingPhysician: string;
  laboratory: string;
  specimenDate: string;
  results: Array<{
    analyte: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    flag?: 'normal' | 'high' | 'low' | 'critical';
  }>;
  interpretation?: string;
}

export interface PrescriptionData {
  medicationName: string;
  dosage: string;
  route: 'Oral' | 'Subcutaneous' | 'Inhalation' | 'Intravenous';
  frequency: string;
  prescribingDoctor: string;
  indication: string;
  startDate: string;
  refillsRemaining: number;
  pharmacy: string;
}

export interface ClinicalNoteData {
  title: string;
  specialty: 'Cardiology' | 'Neurology' | 'Endocrinology' | 'Primary Care' | 'Oncology';
  providerName: string;
  facility: string;
  encounterDate: string;
  chiefComplaint: string;
  assessmentAndPlan: string;
}

export interface EmergencyIceData {
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  organDonor: boolean;
  notes: string;
}

export type PlaintextMedicalData =
  | { type: 'vital_signs'; data: VitalSignsData }
  | { type: 'lab_result'; data: LabResultData }
  | { type: 'prescription'; data: PrescriptionData }
  | { type: 'clinical_note'; data: ClinicalNoteData }
  | { type: 'emergency_ice'; data: EmergencyIceData };

export interface MedicalRecordItem {
  id: string;
  recordType: MedicalRecordType;
  title: string;
  summary: string;
  date: string;
  payload: PlaintextMedicalData;
  // Encrypted wire values
  ciphertext: string;
  iv: string;
  authTag: string;
  keyFingerprint: string;
  checksum: string;
  version: number;
  pendingSync: boolean;
  isDeleted: boolean;
}

export interface AuditLogItem {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  previousHash: string;
  entryHash: string;
}
