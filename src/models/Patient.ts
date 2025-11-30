// Patient model with all medical fields
export interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  
  // Medical information
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  visitSummary?: string;
  diagnosis?: string;
  treatment?: string;
  labResults?: Array<{
    id: string;
    testName: string;
    date: Date;
    result: string;
    normalRange?: string;
    notes?: string;
  }>;
  medications?: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
    prescribedBy?: string;
    notes?: string;
  }>;
  
  // Account status
  isActive: boolean;
  isVerified: boolean;
  lastAccessDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
}

export interface UpdatePatientData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  vitals?: Patient['vitals'];
  visitSummary?: string;
  diagnosis?: string;
  treatment?: string;
  labResults?: Patient['labResults'];
  medications?: Patient['medications'];
}

export interface PatientSearchParams {
  query?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface PatientSearchResult {
  patients: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: Date;
    phone?: string;
    isActive: boolean;
  }>;
  total: number;
}
