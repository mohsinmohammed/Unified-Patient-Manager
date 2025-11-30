# Security & HIPAA Compliance Documentation

## Overview

The Unified Patient Manager is designed with security and HIPAA compliance as core requirements. This document outlines the security measures, compliance features, and best practices implemented in the application.

---

## HIPAA Compliance

### Protected Health Information (PHI)

The application handles the following PHI categories:

- **Demographics**: Name, date of birth, address, phone number, email
- **Medical Records**: Vitals, diagnoses, treatments, medications, lab results
- **Billing Information**: Amounts, payment history, payment methods
- **Account Information**: Login credentials, access patterns

### HIPAA Safeguards Implemented

#### Administrative Safeguards

✅ **Access Controls**
- Role-Based Access Control (RBAC) with three distinct roles: Provider, Patient, Staff
- JWT-based authentication with 24-hour token expiration
- Email verification required for patient registration
- Account status checks (active/inactive, verified/unverified)

✅ **Audit Controls**
- Comprehensive audit logging for all sensitive operations
- Every patient record access logged with timestamp, IP address, user agent
- Account modifications tracked with reason and staff information
- Payment transactions logged with full audit trail

✅ **Workforce Training**
- Clear role definitions and permission boundaries
- Documentation of security procedures (this document)
- Access management protocols documented

#### Physical Safeguards

⚠️ **Deployment Considerations** (Responsibility of deploying organization)
- Secure physical server access
- Backup and disaster recovery procedures
- Facility access controls and monitoring

#### Technical Safeguards

✅ **Access Control**
- Unique user identification (JWT tokens with user ID and role)
- Emergency access procedures (staff account inactivation)
- Automatic logoff after 24 hours (token expiration)
- Encryption and decryption of PHI at rest

✅ **Audit Controls**
- Hardware, software, and procedural mechanisms that record and examine access
- AuditLog table captures: action, actorType, actorId, patientId, details, ipAddress, userAgent, timestamp

✅ **Integrity Controls**
- Input validation on all forms
- SQL injection prevention via Prisma ORM (parameterized queries)
- Type safety via TypeScript

✅ **Transmission Security**
- HTTPS required in production (enforced via deployment configuration)
- JWT tokens transmitted via Authorization header
- Sensitive data encrypted in database

---

## Authentication & Authorization

### Password Security

**Hashing Algorithm**: PBKDF2 (Password-Based Key Derivation Function 2)

```typescript
// Implementation details
- Algorithm: PBKDF2
- Key derivation: SHA-256
- Iterations: 100,000
- Salt: Randomly generated per password
- Output length: 64 bytes (hex encoded)
```

**Password Requirements** (Recommended for production):
- Minimum 8 characters (currently enforced client-side)
- Mix of uppercase, lowercase, numbers, special characters (recommended)
- Password history check (recommended for implementation)
- Password expiration policy (recommended for implementation)

### JWT Tokens

**Token Structure**:
```json
{
  "userId": "uuid",
  "email": "user@email.com",
  "role": "provider|patient|staff",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Management**:
- Stored in localStorage (client-side)
- Transmitted via `Authorization: Bearer <token>` header
- Expires after 24 hours (configurable via `JWT_EXPIRATION` env var)
- No refresh token mechanism (user must re-authenticate)

**Security Considerations**:
- ⚠️ localStorage vulnerable to XSS attacks
- ✅ Recommended: Move to httpOnly cookies for production
- ✅ Recommended: Implement refresh token mechanism
- ✅ Recommended: Add token blacklist for logout

### Role-Based Access Control (RBAC)

**Roles & Permissions**:

| Role     | Permissions |
|----------|-------------|
| Provider | Search patients, View patient records, Update patient records, Create audit logs |
| Patient  | View own bills, Make payments, Update own profile (future) |
| Staff    | Search all patients, Inactivate accounts, View reports, Manage accounts |

**Middleware Implementation**:
```typescript
// src/middleware/auth.ts
export function authMiddleware(req) // Validates JWT token
export function providerOnly(user) // Restricts to providers
export function patientOnly(user)  // Restricts to patients
export function staffOnly(user)    // Restricts to staff
```

**API Route Protection**:
All sensitive API routes protected by `authMiddleware()` and role-specific guards.

---

## Data Encryption

### Encryption at Rest

**Algorithm**: PBKDF2 derived key (AES-256-GCM compatible)

**Encrypted Fields**:
- Patient passwords (hashed with PBKDF2)
- Provider passwords (hashed with PBKDF2)
- Staff passwords (hashed with PBKDF2)

**Note**: Medical records stored in plaintext in database for querying efficiency. For higher security, consider field-level encryption with searchable encryption techniques.

### Encryption in Transit

**Requirements**:
- HTTPS (TLS 1.2 or higher) required for all production deployments
- SSL certificate from trusted CA
- Force HTTPS redirect in production
- HSTS header enabled

**Implementation**:
```nginx
# Example nginx configuration
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

---

## Audit Logging

### What is Logged

All audit logs stored in `AuditLog` table with following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique log ID |
| action | String | Action performed (e.g., "view_patient", "update_patient", "inactivate_account") |
| actorType | String | "Provider", "Patient", or "Staff" |
| actorId | UUID | ID of user who performed action |
| patientId | UUID | ID of affected patient (if applicable) |
| details | JSON | Additional context (e.g., fields changed, reason) |
| ipAddress | String | IP address of request |
| userAgent | String | Browser/client information |
| createdAt | DateTime | Timestamp of action |

### Logged Actions

- **Patient Record Access**: Every time a provider views a patient record
- **Patient Record Updates**: All modifications to medical records with before/after values
- **Account Inactivation**: Staff inactivating patient accounts with reason
- **Payment Processing**: All payment attempts (success and failure)
- **Authentication**: Login attempts (success and failure) - *Recommended for implementation*

### Audit Log Retention

**Current**: Indefinite retention (all logs stored permanently)

**Recommended**:
- Active logs: 6 years (HIPAA minimum)
- Archived logs: Additional 4 years
- Total retention: 10 years
- Implement automated archival process
- Secure offsite backup of archived logs

### Audit Log Access

**Who Can Access**:
- System administrators (via direct database access)
- Compliance officers (future: dedicated audit log viewer)
- External auditors (export functionality recommended)

**Access Controls**:
- Audit logs are write-only from application
- No delete functionality implemented
- Read access restricted to database administrators

---

## Input Validation

### Client-Side Validation

Implemented on all forms:
- Required field checks
- Email format validation
- Date format validation
- Phone number format (future enhancement)
- Password strength indicators (recommended)

### Server-Side Validation

**All API endpoints validate**:
- Request body schema
- Query parameter types and ranges
- Authorization headers
- User permissions

**Example** (Patient Registration):
```typescript
// Validates email format, required fields, password length
if (!email || !password || !firstName || !lastName) {
  return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
}
```

### SQL Injection Prevention

**Prisma ORM** automatically parameterizes all queries:
```typescript
// Safe - parameterized query
await prisma.patient.findUnique({ where: { email } });

// Never use raw SQL without parameterization
```

---

## Session Management

### Session Properties

- **Duration**: 24 hours (configurable)
- **Storage**: Client-side localStorage (JWT token)
- **Renewal**: Manual re-authentication required
- **Termination**: Logout clears localStorage and redirects to login

### Security Recommendations for Production

1. **Use httpOnly Cookies**:
   ```typescript
   // Instead of localStorage
   res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
   ```

2. **Implement Refresh Tokens**:
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Refresh token rotation on use

3. **Add Concurrent Session Limits**:
   - Limit to 3 active sessions per user
   - Track session IDs in database
   - Invalidate oldest session when limit exceeded

4. **Session Monitoring**:
   - Log all session creation/termination
   - Alert on suspicious activity (multiple failed logins, geolocation changes)

---

## API Security

### Rate Limiting

⚠️ **Not Currently Implemented**

**Recommended Implementation**:
```typescript
// Using express-rate-limit or similar
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.'
});

// Apply to all API routes
app.use('/api/', limiter);

// Stricter limits for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
});

app.use('/api/auth/*/login', authLimiter);
```

### CORS Configuration

Currently allows all origins (development mode).

**Production Configuration**:
```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

### Content Security Policy (CSP)

**Recommended Headers**:
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
];
```

---

## Vulnerability Prevention

### Cross-Site Scripting (XSS)

✅ **Protections**:
- React automatically escapes output
- No `dangerouslySetInnerHTML` usage
- Input sanitization on server-side

⚠️ **Recommendations**:
- Add Content Security Policy headers
- Sanitize user-generated content with DOMPurify

### Cross-Site Request Forgery (CSRF)

⚠️ **Current Status**: Not explicitly protected

**Recommended Implementation**:
```typescript
// Add CSRF tokens to all state-changing requests
// Use SameSite=Strict cookies
// Validate Origin/Referer headers
```

### SQL Injection

✅ **Protected**: Prisma ORM uses parameterized queries exclusively

### Server-Side Request Forgery (SSRF)

✅ **Not Applicable**: No user-provided URLs fetched by server

### Dependency Vulnerabilities

**Current Process**:
```bash
npm audit
```

**Recommended Process**:
- Run `npm audit` before each deployment
- Use Dependabot or Snyk for automated vulnerability scanning
- Update dependencies monthly
- Security patch releases applied within 48 hours

---

## Incident Response

### Detection

**Monitoring** (Recommended):
- Failed login attempts (> 5 in 15 minutes)
- Unusual access patterns (time, location, device)
- High volume API requests
- Database errors or slow queries
- Unauthorized access attempts

### Response Procedures

1. **Identification**:
   - Review audit logs
   - Check for affected patients/records
   - Assess scope of breach

2. **Containment**:
   - Disable affected user accounts
   - Invalidate tokens if needed
   - Block IP addresses if applicable

3. **Investigation**:
   - Review system logs
   - Identify root cause
   - Document findings

4. **Recovery**:
   - Apply security patches
   - Reset affected passwords
   - Restore from backups if needed

5. **Notification**:
   - Notify affected patients (HIPAA Breach Notification Rule)
   - Report to HHS if > 500 individuals affected
   - Document incident response

---

## Compliance Checklist

### Required for Production

- [ ] Enable HTTPS with valid SSL certificate
- [ ] Move JWT tokens to httpOnly cookies
- [ ] Implement rate limiting on all API endpoints
- [ ] Add Content Security Policy headers
- [ ] Implement CSRF protection
- [ ] Set up automated vulnerability scanning
- [ ] Configure CORS for production domain only
- [ ] Implement session monitoring and alerting
- [ ] Add password complexity requirements
- [ ] Set up audit log archival process
- [ ] Create incident response plan
- [ ] Conduct security audit and penetration testing
- [ ] Implement database backup and recovery
- [ ] Add multi-factor authentication (recommended)
- [ ] Encrypt sensitive fields in database (recommended)

### HIPAA Business Associate Agreement (BAA)

If deploying for a covered entity, ensure:
- [ ] BAA signed with hosting provider
- [ ] BAA includes subcontractor provisions
- [ ] Stripe BAA in place for payment processing
- [ ] Email service provider BAA if applicable
- [ ] All third-party services HIPAA-compliant

---

## Security Best Practices for Developers

1. **Never commit secrets**: Use `.env` files, never commit to Git
2. **Validate all inputs**: Client-side AND server-side
3. **Use parameterized queries**: Always use Prisma ORM, never raw SQL
4. **Hash passwords**: Never store plaintext passwords
5. **Minimize permissions**: Apply principle of least privilege
6. **Log sensitive actions**: Every PHI access must be logged
7. **Keep dependencies updated**: Regular `npm audit` and updates
8. **Code reviews required**: All security-related changes require review
9. **Test authentication**: Verify role-based access on all new endpoints
10. **Document security decisions**: Update this document with changes

---

## Contact

For security concerns or to report vulnerabilities:

- **Email**: security@hospital.com
- **Response Time**: 24 hours for critical issues
- **Encryption**: PGP key available upon request

---

**Last Updated**: November 29, 2025  
**Version**: 1.0.0  
**Reviewed By**: Development Team
