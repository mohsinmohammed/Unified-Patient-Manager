// Patient login API route
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/utils/encryption';
import { generateToken } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import prisma from '@/utils/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find patient by email
    const patient = await prisma.patient.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!patient.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = verifyPassword(password, patient.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!patient.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email address before logging in' },
        { status: 403 }
      );
    }

    // Update last access date
    await prisma.patient.update({
      where: { id: patient.id },
      data: { lastAccessDate: new Date() },
    });

    // Generate JWT token
    const token = generateToken({
      id: patient.id,
      email: patient.email,
      role: 'patient',
      userType: 'Patient',
    });

    // Return token and patient info (without password)
    return NextResponse.json({
      token,
      patient: {
        id: patient.id,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        phone: patient.phone,
        isVerified: patient.isVerified,
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
