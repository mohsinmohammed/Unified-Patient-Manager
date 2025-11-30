// Patient search API route
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { providerOnly } from '@/middleware/rbac';
import { patientService } from '@/services/patientService';
import { handleAPIError } from '@/middleware/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    const rbacError = await providerOnly(request, user);
    if (rbacError) return rbacError;

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await patientService.searchPatients({
      query,
      isActive: true,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleAPIError(error);
  }
}
