export interface Medication {
  id: string;
  name: string;
  description: string;
  dosage: string;
  unit: 'mg' | 'ml' | 'tablets' | 'capsules';
  instructions: string;
  sideEffects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMedicationData {
  name: string;
  description: string;
  dosage: string;
  unit: 'mg' | 'ml' | 'tablets' | 'capsules';
  instructions: string;
  sideEffects: string[];
}