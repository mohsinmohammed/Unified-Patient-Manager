// Payment processing API route
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import { billingService } from '@/services/billingService';
import { createAuditLog, getClientIP, getUserAgent } from '@/utils/auditLog';

// Middleware to ensure only patients can process payments
async function patientOnly(request: NextRequest, user: any) {
  if (user.role !== 'patient') {
    return NextResponse.json(
      { error: 'Access denied. Patients only.' },
      { status: 403 }
    );
  }
  return null;
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { billId, paymentMethodId } = body;

    if (!billId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Bill ID and payment method are required' },
        { status: 400 }
      );
    }

    // Process payment
    const result = await billingService.processPayment(
      billId,
      user.id,
      paymentMethodId
    );

    if (!result.success) {
      // Log failed payment attempt
      await createAuditLog({
        action: 'payment',
        actorType: 'patient',
        actorId: user.id,
        patientId: user.id,
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        details: { billId, error: result.error, status: 'failed' },
      });

      return NextResponse.json(
        { error: result.error || 'Payment failed' },
        { status: 400 }
      );
    }

    // Log successful payment
    await createAuditLog({
      action: 'payment',
      actorType: 'patient',
      actorId: user.id,
      patientId: user.id,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      details: { billId, amount: result.bill?.amount },
    });

    return NextResponse.json({
      message: 'Payment processed successfully',
      bill: result.bill,
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
