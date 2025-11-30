// Patient registration API route
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/utils/encryption';
import { emailService } from '@/services/emailService';
import { handleAPIError } from '@/middleware/errorHandler';
import prisma from '@/utils/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, dateOfBirth, phone, address } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingPatient) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Create patient account
    const patient = await prisma.patient.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        phone: phone || null,
        address: address || null,
        isVerified: false,
        verificationToken,
        isActive: true,
      },
    });

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue registration even if email fails
    }

    // Return success without sensitive data
    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      patient: {
        id: patient.id,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        isVerified: patient.isVerified,
      },
    }, { status: 201 });

  } catch (error) {
    return handleAPIError(error);
  }
}
