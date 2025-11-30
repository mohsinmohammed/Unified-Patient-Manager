// Patient account inactivation API for staff
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, staffOnly } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import { accountService } from '@/services/accountService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate and authorize staff
    const user = await authMiddleware(request);
    staffOnly(user);

    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    // Get client info for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Inactivate the account
    const result = await accountService.inactivateAccount({
      patientId: id,
      staffId: user.id,
      reason,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      message: 'Patient account has been inactivated successfully',
      patient: result.patient,
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
