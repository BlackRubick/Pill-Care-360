export interface ComplianceData {
  patientId: string;
  treatmentId: string;
  date: Date;
  scheduledDoses: number;
  takenDoses: number;
  missedDoses: number;
  complianceRate: number; // porcentaje
}

export interface Alert {
  id: string;
  patientId: string;
  treatmentId: string;
  type: 'missed_dose' | 'late_dose' | 'low_compliance' | 'treatment_end';
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: Date;
}

export interface UsageHistory {
  id: string;
  patientId: string;
  treatmentId: string;
  action: 'dose_taken' | 'dose_missed' | 'alarm_snoozed' | 'treatment_started' | 'treatment_stopped';
  timestamp: Date;
  metadata?: {
    scheduledTime?: Date;
    actualTime?: Date;
    notes?: string;
  };
}

export interface ComplianceReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalTreatments: number;
  overallCompliance: number;
  patientCompliance: {
    patientId: string;
    patientName: string;
    complianceRate: number;
    treatmentCount: number;
  }[];
  trendData: {
    date: Date;
    compliance: number;
  }[];
}