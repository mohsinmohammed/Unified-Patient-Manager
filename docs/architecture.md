# System Architecture Documentation

## Overview

Unified Patient Manager is a HIPAA-compliant healthcare web application built with Next.js 16, providing secure patient record management, billing, and administrative capabilities.

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.5 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **State Management**: React useState/useEffect hooks
- **Client Storage**: LocalStorage for JWT tokens

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.22.0
- **Authentication**: JWT with bcryptjs
- **Payment Processing**: Mock Stripe integration

### DevOps
- **Build Tool**: Turbopack (Next.js 16)
- **Package Manager**: npm
- **Environment**: Docker-ready configuration
- **Version Control**: Git

## Architecture Pattern

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components, Pages, Layout)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         API Layer (Next.js Routes)      │
│  (Authentication, Authorization, RBAC)  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Service Layer                   │
│  (Business Logic, Validation)           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Data Access Layer (Prisma)      │
│  (Database Operations, ORM)             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Database (PostgreSQL)           │
└─────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── app/                        # Next.js App Router
│   ├── api/                   # API Routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── provider/
│   │   │   ├── patient/
│   │   │   ├── staff/
│   │   │   └── verify/
│   │   ├── patients/          # Patient CRUD operations
│   │   ├── bills/             # Billing operations
│   │   ├── payments/          # Payment processing
│   │   ├── staff/             # Staff operations
│   │   └── reports/           # Reporting endpoints
│   ├── provider/              # Provider UI pages
│   ├── patient/               # Patient UI pages
│   └── staff/                 # Staff UI pages
├── components/                # Reusable React components
├── middleware/                # Auth, RBAC, Error handling
├── services/                  # Business logic layer
├── utils/                     # Utility functions
└── config/                    # Configuration management

prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed data

docs/                         # Documentation
scripts/                      # Utility scripts
```

## Core Components

### 1. Authentication System
- **JWT-based**: Stateless authentication with token expiration
- **Role-based**: Three user types (Provider, Patient, Staff)
- **Password Hashing**: PBKDF2 with salt
- **Email Verification**: Token-based verification for patients

### 2. Authorization (RBAC)
- **Middleware**: `authMiddleware()` validates JWT tokens
- **Role Guards**: `providerOnly()`, `patientOnly()`, `staffOnly()`
- **Permission Checks**: Role-specific access to endpoints and UI

### 3. Data Models

**User Types:**
- **Provider**: Healthcare providers with patient record access
- **Patient**: Patients with personal dashboard and billing
- **Staff**: Administrative staff with account management

**Core Entities:**
- **Patient**: Medical records, vitals, diagnosis, treatment
- **Bill**: Payment tracking with Stripe integration
- **AuditLog**: HIPAA-compliant activity logging

### 4. Services Layer

**PatientService** (`src/services/patientService.ts`)
- Patient search and retrieval
- Record updates with validation
- Access logging

**BillingService** (`src/services/billingService.ts`)
- Bill management
- Payment processing
- Outstanding balance calculations

**AccountService** (`src/services/accountService.ts`)
- Patient account search
- Account inactivation
- Inactive account reporting

**EmailService** (`src/services/emailService.ts`)
- Verification emails
- Payment confirmations
- SMTP integration

**StripeService** (`src/services/stripeService.ts`)
- Mock payment processing
- Payment intent creation
- Transaction tracking

### 5. Security Features

**Encryption** (`src/utils/encryption.ts`)
- Password hashing with PBKDF2
- Verification token generation
- Sensitive data encryption (HIPAA compliance)

**Audit Logging** (`src/utils/auditLog.ts`)
- All patient record access logged
- Account changes tracked
- IP address and user agent captured
- Payment activities recorded

**Input Validation**
- Email format validation
- Password strength requirements (min 8 chars)
- Required field validation
- Duplicate account prevention

## User Flows

### Provider Flow
1. Login → Dashboard
2. Search patients by name/email/ID
3. View patient record (audit logged)
4. Edit medical records (audit logged)
5. Changes saved to database

### Patient Flow
1. Register → Email verification
2. Login (with active/verified checks)
3. View dashboard with bills
4. Select bill → Payment modal
5. Submit payment → Stripe processing
6. Audit log created → Bill marked paid

### Staff Flow
1. Login → Dashboard
2. Search patients
3. Inactivate account (with reason)
4. View inactive accounts report
5. Filter by years inactive

## Database Schema

### Key Relationships
- Patient → Bills (1:many)
- Patient → AuditLogs (1:many)
- AuditLog references Patient, Provider, Staff (polymorphic)

### Indexes
- Patient: email (unique), lastAccessDate
- Bill: patientId, status
- AuditLog: actorId, patientId, timestamp, action

## API Design Principles

### RESTful Conventions
- GET: Retrieve data
- POST: Create new resources
- PUT: Update existing resources
- DELETE: Remove resources (not implemented - soft delete preferred)

### Response Format
```json
{
  "data": { /* response payload */ },
  "error": "error message if any",
  "message": "success message"
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Performance Considerations

### Database Optimization
- Indexed fields for fast queries
- Prisma connection pooling
- Selective field queries (reduce payload)

### Frontend Optimization
- Code splitting by route (Next.js automatic)
- Lazy loading for large components
- LocalStorage for auth state (reduce API calls)

### Caching Strategy
- Client-side: LocalStorage for user info
- Server-side: Consider Redis for session data (future)

## Security Best Practices

### HIPAA Compliance
- All patient access logged
- Encrypted data at rest (PostgreSQL encryption)
- Secure transmission (HTTPS in production)
- Role-based access control
- Audit trail for all changes

### Authentication Security
- JWT with expiration (24h default)
- Password hashing with salt
- No plaintext passwords stored
- Secure password reset flow (via email)

### API Security
- Authentication required for all protected routes
- Role-based authorization
- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)
- XSS prevention (React escaping)

## Deployment Architecture

### Production Environment
```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │  HTTPS  │
    └────┬────┘
         │
┌────────┴─────────┐
│   Next.js App    │
│   (Docker)       │
└────────┬─────────┘
         │
┌────────┴─────────┐
│   PostgreSQL     │
│   (Managed DB)   │
└──────────────────┘
```

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Token signing secret
- `ENCRYPTION_KEY`: Data encryption key
- `STRIPE_SECRET_KEY`: Payment processing
- `SMTP_*`: Email service credentials

## Monitoring & Logging

### Application Logs
- Console logs for debugging
- Error tracking (console.error)
- Audit logs in database

### Future Enhancements
- Structured logging (Winston, Pino)
- Error monitoring (Sentry)
- Performance monitoring (New Relic)
- Health check endpoints

## Scalability Considerations

### Horizontal Scaling
- Stateless API (JWT-based auth)
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Database optimization (indexes, queries)
- Caching layer (Redis)
- CDN for static assets

## Testing Strategy

### Unit Tests
- Service layer functions
- Utility functions (encryption, validation)

### Integration Tests
- API endpoint testing
- Database operations

### E2E Tests
- User flow testing
- Cross-browser testing

## Future Roadmap

### Phase 8: Advanced Features
- Real-time notifications (WebSocket)
- Document upload (medical records, bills)
- Multi-factor authentication (MFA)
- Advanced reporting and analytics
- Mobile app (React Native)

### Phase 9: Enterprise Features
- Multi-tenant support
- SSO integration (SAML, OAuth)
- Advanced audit reports
- Data export/import
- API rate limiting

## Maintenance

### Regular Tasks
- Dependency updates (npm audit)
- Database backups
- Security patches
- Performance monitoring
- Log rotation

### Database Maintenance
- Regular backups
- Index optimization
- Query performance analysis
- Data archival (old records)

---

**Last Updated**: November 29, 2025
**Version**: 1.0.0
**Maintained By**: Development Team
