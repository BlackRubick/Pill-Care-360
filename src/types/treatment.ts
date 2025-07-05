import type { Patient, Medication } from './index';

export interface Treatment {
  id: string;
  patientId: string;
  patient?: Patient;
  medicationId: string;
  medication?: Medication;
  dosage: string;
  frequency: number; // veces por día
  duration: number; // días
  startDate: Date;
  endDate: Date;
  instructions: string;
  alarms: Alarm[];
  status: 'active' | 'completed' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Alarm {
  id: string;
  treatmentId: string;
  time: string; // formato HH:mm
  isActive: boolean;
  soundEnabled: boolean;
  visualEnabled: boolean;
  description: string;
}

export interface CreateTreatmentData {
  patientId: string;
  medicationId: string;
  dosage: string;
  frequency: number;
  duration: number;
  startDate: string;
  instructions: string;
  alarms: Omit<Alarm, 'id' | 'treatmentId'>[];
}

export interface DoseRecord {
  id: string;
  treatmentId: string;
  scheduledTime: Date;
  actualTime?: Date;
  status: 'taken' | 'missed' | 'pending';
  notes?: string;
  createdAt: Date;
}