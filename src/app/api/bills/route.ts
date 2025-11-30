// Patient bills API route
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import { billingService } from '@/services/billingService';

// Middleware to ensure only patients can access their own bills
async function patientOnly(request: NextRequest, user: any) {
  if (user.role !== 'patient') {
    return NextResponse.json(
      { error: 'Access denied. Patients only.' },
      { status: 403 }
    );
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    const rbacError = await patientOnly(request, user);
    if (rbacError) return rbacError;

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Optional: filter by status

    let bills;
    if (status === 'pending') {
      bills = await billingService.getPendingBills(user.id);
    } else if (status === 'paid') {
      bills = await billingService.getPaymentHistory(user.id);
    } else {
      bills = await billingService.getPatientBills(user.id);
    }

    // Get outstanding balance
    const outstandingBalance = await billingService.getOutstandingBalance(user.id);

    return NextResponse.json({
      bills,
      outstandingBalance,
      count: bills.length,
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
