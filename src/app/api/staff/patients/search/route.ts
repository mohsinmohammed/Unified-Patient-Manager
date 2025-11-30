// Patient search API for staff
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, staffOnly } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import { accountService } from '@/services/accountService';

export async function GET(request: NextRequest) {
  try {
    // Authenticate and authorize staff
    const user = await authMiddleware(request);
    staffOnly(user);

    // Get search query from URL params
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Search for patients
    const patients = await accountService.searchPatients({
      query,
      limit,
    });

    return NextResponse.json({
      patients,
      count: patients.length,
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
