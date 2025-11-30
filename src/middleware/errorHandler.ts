// Base API error handling middleware
import { NextResponse } from 'next/server';

export class APIError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message,
        type: error.name
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors from validation utility
  if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationException' && 'errors' in error) {
    const validationError = error as unknown as { errors: Array<{ field: string; message: string }> };
    return NextResponse.json(
      {
        error: 'Validation failed',
        type: 'ValidationException',
        details: validationError.errors
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any };
    
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { error: 'A record with this information already exists' },
        { status: 409 }
      );
    }
    
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
  }

  // Generic error
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export type APIHandler<T = any> = () => Promise<T>;

export async function withErrorHandling<T>(
  handler: APIHandler<T>
): Promise<NextResponse> {
  try {
    const result = await handler();
    return NextResponse.json(result);
  } catch (error) {
    return handleAPIError(error);
  }
}
