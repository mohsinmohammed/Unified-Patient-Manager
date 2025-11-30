// Role-based access control (RBAC) middleware
import { NextRequest, NextResponse } from 'next/server';
import { AuthUser } from './auth';

export type UserRole = 'provider' | 'patient' | 'staff';

export interface RBACConfig {
  allowedRoles: UserRole[];
  permissions?: string[];
}

export function checkRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function checkPermission(user: AuthUser, permission: string): boolean {
  // This is a simple implementation
  // In production, you'd query the database for user permissions
  return true;
}

export function rbacMiddleware(config: RBACConfig) {
  return async (request: NextRequest, user: AuthUser | null) => {
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!checkRole(user, config.allowedRoles)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check specific permissions if provided
    if (config.permissions && config.permissions.length > 0) {
      const hasPermission = config.permissions.every(permission =>
        checkPermission(user, permission)
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }

    return null; // Null means authorization passed
  };
}

export const providerOnly = rbacMiddleware({ allowedRoles: ['provider'] });
export const patientOnly = rbacMiddleware({ allowedRoles: ['patient'] });
export const staffOnly = rbacMiddleware({ allowedRoles: ['staff'] });
export const providerOrStaff = rbacMiddleware({ allowedRoles: ['provider', 'staff'] });
