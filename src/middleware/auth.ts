// Authentication middleware with JWT
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  id: string;
  email: string;
  role: 'provider' | 'patient' | 'staff';
  userType: 'Provider' | 'Patient' | 'Staff';
}

export interface AuthRequest extends NextRequest {
  user?: AuthUser;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function generateToken(user: AuthUser): string {
  const expiresIn = process.env.JWT_EXPIRY || '24h';
  return jwt.sign(user, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export async function authMiddleware(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    
    return user;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}

export function createAuthResponse(message: string, status: number = 401) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

// Role-based access control helpers
export function providerOnly(user: AuthUser | null): asserts user is AuthUser {
  if (!user) {
    throw new Error('Authentication required');
  }
  if (user.role !== 'provider') {
    throw new Error('Access denied. Provider role required.');
  }
}

export function patientOnly(user: AuthUser | null): asserts user is AuthUser {
  if (!user) {
    throw new Error('Authentication required');
  }
  if (user.role !== 'patient') {
    throw new Error('Access denied. Patient role required.');
  }
}

export function staffOnly(user: AuthUser | null): asserts user is AuthUser {
  if (!user) {
    throw new Error('Authentication required');
  }
  if (user.role !== 'staff') {
    throw new Error('Access denied. Staff role required.');
  }
}
