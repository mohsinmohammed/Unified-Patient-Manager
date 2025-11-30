// Get and update patient record API route
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { providerOnly } from '@/middleware/rbac';
import { patientService } from '@/services/patientService';
import { handleAPIError, NotFoundError } from '@/middleware/errorHandler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authMiddleware(request);
    const rbacError = await providerOnly(request, user);
    if (rbacError) return rbacError;

    const { id } = await params;
    const patient = await patientService.getPatientById(id, user?.id, 'provider', request);
    
    if (!patient) {
      throw new NotFoundError('Patient');
    }

    return NextResponse.json(patient);
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authMiddleware(request);
    const rbacError = await providerOnly(request, user);
    if (rbacError) return rbacError;

    const { id } = await params;
    const body = await request.json();
    const updated = await patientService.updatePatient(id, body, user?.id, 'provider', request);

    return NextResponse.json(updated);
  } catch (error) {
    return handleAPIError(error);
  }
}
