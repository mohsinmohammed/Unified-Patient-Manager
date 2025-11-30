// Patient data validation utilities
import { UpdatePatientData } from '@/models/Patient';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationException extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationException';
    this.errors = errors;
  }
}

/**
 * Validate patient update data
 */
export function validatePatientUpdate(data: UpdatePatientData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate first name
  if (data.firstName !== undefined) {
    if (typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    } else if (data.firstName.length > 100) {
      errors.push({ field: 'firstName', message: 'First name must be 100 characters or less' });
    }
  }

  // Validate last name
  if (data.lastName !== undefined) {
    if (typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    } else if (data.lastName.length > 100) {
      errors.push({ field: 'lastName', message: 'Last name must be 100 characters or less' });
    }
  }

  // Validate phone
  if (data.phone !== undefined && data.phone !== null) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
      errors.push({ field: 'phone', message: 'Phone number contains invalid characters' });
    }
  }

  // Validate vitals if provided
  if (data.vitals) {
    const vitals = data.vitals as any;
    
    if (vitals.heartRate !== undefined && vitals.heartRate !== null) {
      if (typeof vitals.heartRate !== 'number' || vitals.heartRate < 30 || vitals.heartRate > 250) {
        errors.push({ field: 'vitals.heartRate', message: 'Heart rate must be between 30 and 250 bpm' });
      }
    }

    if (vitals.temperature !== undefined && vitals.temperature !== null) {
      if (typeof vitals.temperature !== 'number' || vitals.temperature < 90 || vitals.temperature > 110) {
        errors.push({ field: 'vitals.temperature', message: 'Temperature must be between 90 and 110°F' });
      }
    }

    if (vitals.weight !== undefined && vitals.weight !== null) {
      if (typeof vitals.weight !== 'number' || vitals.weight < 1 || vitals.weight > 1000) {
        errors.push({ field: 'vitals.weight', message: 'Weight must be between 1 and 1000 lbs' });
      }
    }

    if (vitals.height !== undefined && vitals.height !== null) {
      if (typeof vitals.height !== 'number' || vitals.height < 10 || vitals.height > 100) {
        errors.push({ field: 'vitals.height', message: 'Height must be between 10 and 100 inches' });
      }
    }

    if (vitals.oxygenSaturation !== undefined && vitals.oxygenSaturation !== null) {
      if (typeof vitals.oxygenSaturation !== 'number' || vitals.oxygenSaturation < 0 || vitals.oxygenSaturation > 100) {
        errors.push({ field: 'vitals.oxygenSaturation', message: 'Oxygen saturation must be between 0 and 100%' });
      }
    }

    if (vitals.respiratoryRate !== undefined && vitals.respiratoryRate !== null) {
      if (typeof vitals.respiratoryRate !== 'number' || vitals.respiratoryRate < 5 || vitals.respiratoryRate > 60) {
        errors.push({ field: 'vitals.respiratoryRate', message: 'Respiratory rate must be between 5 and 60 breaths/min' });
      }
    }
  }

  // Validate lab results if provided
  if (data.labResults && Array.isArray(data.labResults)) {
    data.labResults.forEach((lab: any, index: number) => {
      if (!lab.testName) {
        errors.push({ field: `labResults[${index}].testName`, message: 'Test name is required' });
      }
      if (!lab.result) {
        errors.push({ field: `labResults[${index}].result`, message: 'Test result is required' });
      }
      if (!lab.date) {
        errors.push({ field: `labResults[${index}].date`, message: 'Test date is required' });
      }
    });
  }

  // Validate medications if provided
  if (data.medications && Array.isArray(data.medications)) {
    data.medications.forEach((med: any, index: number) => {
      if (!med.name) {
        errors.push({ field: `medications[${index}].name`, message: 'Medication name is required' });
      }
      if (!med.dosage) {
        errors.push({ field: `medications[${index}].dosage`, message: 'Dosage is required' });
      }
      if (!med.frequency) {
        errors.push({ field: `medications[${index}].frequency`, message: 'Frequency is required' });
      }
      if (!med.startDate) {
        errors.push({ field: `medications[${index}].startDate`, message: 'Start date is required' });
      }
    });
  }

  return errors;
}

/**
 * Validate and throw exception if errors exist
 */
export function validateOrThrow(data: UpdatePatientData): void {
  const errors = validatePatientUpdate(data);
  if (errors.length > 0) {
    throw new ValidationException(errors);
  }
}
