// Account management service for staff operations
import prisma from '@/utils/prisma';
import { createAuditLog } from '@/utils/auditLog';

interface InactivateAccountParams {
  patientId: string;
  staffId: string;
  reason?: string;
  ipAddress: string;
  userAgent?: string;
}

interface SearchPatientsParams {
  query: string;
  limit?: number;
}

class AccountManagementService {
  /**
   * Search for patients by name, email, or ID
   */
  async searchPatients({ query, limit = 50 }: SearchPatientsParams) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      return [];
    }

    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { id: { equals: searchTerm } }, // Exact ID match
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        phone: true,
        isActive: true,
        isVerified: true,
        lastAccessDate: true,
        createdAt: true,
      },
      take: limit,
      orderBy: {
        lastName: 'asc',
      },
    });

    return patients;
  }

  /**
   * Inactivate a patient account
   */
  async inactivateAccount({
    patientId,
    staffId,
    reason,
    ipAddress,
    userAgent,
  }: InactivateAccountParams) {
    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Check if already inactive
    if (!patient.isActive) {
      throw new Error('Patient account is already inactive');
    }

    // Inactivate the account
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    // Create audit log
    await createAuditLog({
      action: 'inactivate',
      actorType: 'staff',
      actorId: staffId,
      patientId,
      ipAddress,
      userAgent,
      details: {
        reason: reason || 'No reason provided',
        patientEmail: patient.email,
        patientName: `${patient.firstName} ${patient.lastName}`,
      },
    });

    return {
      success: true,
      patient: updatedPatient,
    };
  }

  /**
   * Get list of inactive accounts (for reporting)
   */
  async getInactiveAccounts(minYears: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - minYears);

    const inactivePatients = await prisma.patient.findMany({
      where: {
        OR: [
          {
            // Never accessed
            lastAccessDate: null,
            createdAt: { lte: cutoffDate },
          },
          {
            // Not accessed in X years
            lastAccessDate: { lte: cutoffDate },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        lastAccessDate: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: {
        lastAccessDate: 'asc',
      },
    });

    return inactivePatients;
  }

}

// Export singleton instance
export const accountService = new AccountManagementService();
