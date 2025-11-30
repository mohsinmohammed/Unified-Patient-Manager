// PatientService with CRUD and search operations
import prisma from '@/utils/prisma';
import { Patient, UpdatePatientData, PatientSearchParams, PatientSearchResult } from '@/models/Patient';
import { hashPassword } from '@/utils/encryption';
import { Prisma } from '@prisma/client';
import { logPatientAccess, logAccountAction } from '@/utils/auditLog';
import { validateOrThrow } from '@/utils/validation';

class PatientService {
  /**
   * Get patient by ID
   */
  async getPatientById(id: string, actorId?: string, actorType?: 'provider' | 'staff', request?: Request): Promise<Patient | null> {
    try {
      const patient = await prisma.patient.findUnique({
        where: { id },
      });

      if (!patient) {
        return null;
      }

      // Log patient access if actor information provided
      if (actorId && actorType && request) {
        await logPatientAccess(actorType, actorId, id, request, 'access');
      }

      return this.mapToPatientModel(patient);
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw new Error('Failed to fetch patient');
    }
  }

  /**
   * Search patients by query
   */
  async searchPatients(params: PatientSearchParams): Promise<PatientSearchResult> {
    try {
      const { query, isActive, limit = 50, offset = 0 } = params;

      const where: Prisma.PatientWhereInput = {};

      if (query) {
        where.OR = [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            dateOfBirth: true,
            phone: true,
            isActive: true,
          },
          take: limit,
          skip: offset,
          orderBy: { lastName: 'asc' },
        }),
        prisma.patient.count({ where }),
      ]);

      return {
        patients: patients.map(p => ({
          ...p,
          dateOfBirth: p.dateOfBirth ?? undefined,
          phone: p.phone ?? undefined,
        })),
        total,
      };
    } catch (error) {
      console.error('Error searching patients:', error);
      throw new Error('Failed to search patients');
    }
  }

  /**
   * Update patient record
   */
  async updatePatient(id: string, data: UpdatePatientData, actorId?: string, actorType?: 'provider' | 'staff', request?: Request): Promise<Patient> {
    try {
      // Validate input data
      validateOrThrow(data);

      const updated = await prisma.patient.update({
        where: { id },
        data: {
          ...data,
          vitals: data.vitals as any,
          labResults: data.labResults as any,
          medications: data.medications as any,
        },
      });

      // Log patient update if actor information provided
      if (actorId && actorType && request) {
        await logPatientAccess(actorType, actorId, id, request, 'update');
      }

      return this.mapToPatientModel(updated);
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  /**
   * Create a new patient
   */
  async createPatient(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    phone?: string;
    address?: string;
  }): Promise<Patient> {
    try {
      const hashedPassword = hashPassword(data.password);

      const patient = await prisma.patient.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          phone: data.phone,
          address: data.address,
        },
      });

      return this.mapToPatientModel(patient);
    } catch (error) {
      console.error('Error creating patient:', error);
      throw new Error('Failed to create patient');
    }
  }

  /**
   * Update patient's last access date
   */
  async updateLastAccessDate(id: string): Promise<void> {
    try {
      await prisma.patient.update({
        where: { id },
        data: { lastAccessDate: new Date() },
      });
    } catch (error) {
      console.error('Error updating last access date:', error);
    }
  }

  /**
   * Map Prisma patient to Patient model
   */
  private mapToPatientModel(patient: any): Patient {
    return {
      id: patient.id,
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      phone: patient.phone || undefined,
      address: patient.address || undefined,
      vitals: patient.vitals || undefined,
      visitSummary: patient.visitSummary || undefined,
      diagnosis: patient.diagnosis || undefined,
      treatment: patient.treatment || undefined,
      labResults: patient.labResults || undefined,
      medications: patient.medications || undefined,
      isActive: patient.isActive,
      isVerified: patient.isVerified,
      lastAccessDate: patient.lastAccessDate || undefined,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }
}

export const patientService = new PatientService();
