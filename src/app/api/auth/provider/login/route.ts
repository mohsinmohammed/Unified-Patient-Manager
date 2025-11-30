// Provider authentication API route
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { verifyPassword } from '@/utils/encryption';
import { generateToken } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import { logAccountAction } from '@/utils/auditLog';

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

    // Find provider by email
    const provider = await prisma.provider.findUnique({
      where: { email },
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = verifyPassword(password, provider.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if provider is active
    if (!provider.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: provider.id,
      email: provider.email,
      role: 'provider',
      userType: 'Provider',
    });

    // Log the login action
    await logAccountAction('provider', provider.id, 'login', request);

    return NextResponse.json({
      token,
      provider: {
        id: provider.id,
        email: provider.email,
        firstName: provider.firstName,
        lastName: provider.lastName,
        role: provider.role,
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
