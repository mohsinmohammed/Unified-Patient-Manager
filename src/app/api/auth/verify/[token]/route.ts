// Email verification API route
import { NextRequest, NextResponse } from 'next/server';
import { handleAPIError, NotFoundError } from '@/middleware/errorHandler';
import prisma from '@/utils/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find patient with this verification token
    const patient = await prisma.patient.findFirst({
      where: {
        verificationToken: token,
        isVerified: false,
      },
    });

    if (!patient) {
      throw new NotFoundError('Invalid or expired verification token');
    }

    // Update patient to verified status
    await prisma.patient.update({
      where: { id: patient.id },
      data: {
        isVerified: true,
        verificationToken: null, // Clear the token after verification
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Email verified successfully. You can now log in to your account.',
      verified: true,
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
