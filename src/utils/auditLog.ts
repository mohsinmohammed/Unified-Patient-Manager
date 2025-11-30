// Audit logging utility with IP tracking
import prisma from './prisma';

export interface AuditLogData {
  action: 'access' | 'update' | 'create' | 'delete' | 'inactivate' | 'login' | 'payment';
  actorType: 'provider' | 'patient' | 'staff';
  actorId: string;
  patientId?: string;
  ipAddress: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: data.action,
        actorType: data.actorType,
        actorId: data.actorId,
        patientId: data.patientId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        details: data.details || {},
      },
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

export function getClientIP(request: Request): string {
  // Try to get real IP from various headers
  const headers = request.headers;
  
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }
  
  // Fallback to a default value
  return 'unknown';
}

export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

export async function logPatientAccess(
  actorType: 'provider' | 'staff',
  actorId: string,
  patientId: string,
  request: Request,
  action: 'access' | 'update' = 'access'
): Promise<void> {
  await createAuditLog({
    action,
    actorType,
    actorId,
    patientId,
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request),
  });
}

export async function logAccountAction(
  actorType: 'provider' | 'patient' | 'staff',
  actorId: string,
  action: 'create' | 'inactivate' | 'login',
  request: Request,
  patientId?: string
): Promise<void> {
  await createAuditLog({
    action,
    actorType,
    actorId,
    patientId,
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request),
  });
}

export async function logPayment(
  patientId: string,
  billId: string,
  amount: number,
  status: 'success' | 'failed',
  request: Request
): Promise<void> {
  await createAuditLog({
    action: 'payment',
    actorType: 'patient',
    actorId: patientId,
    patientId,
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request),
    details: { billId, amount, status },
  });
}
