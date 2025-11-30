// Staff login API route
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/utils/encryption';
import { generateToken } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import prisma from '@/utils/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find staff by email
    const staff = await prisma.staff.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    // Check if staff exists
    if (!staff) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!staff.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact administration.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = verifyPassword(password, staff.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: staff.id,
      email: staff.email,
      role: 'staff',
      userType: 'Staff',
    });

    // Return token and staff info (without password)
    return NextResponse.json({
      token,
      staff: {
        id: staff.id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
        permissions: staff.permissions,
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
