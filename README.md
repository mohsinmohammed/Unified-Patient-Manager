# Unified Patient Manager

A comprehensive healthcare management system built with Next.js, TypeScript, and PostgreSQL. This application enables healthcare providers, patients, and staff to manage medical records, billing, and account administration in compliance with HIPAA regulations.

---

## Features

### 👨‍⚕️ Provider Portal
- Secure authentication with role-based access control
- Patient search and record management
- View and update medical records (vitals, diagnoses, treatments, medications)
- Comprehensive audit logging for all patient data access

### 👤 Patient Portal
- Self-service registration with email verification
- Secure login with account status validation
- View outstanding and paid bills
- Online bill payment with Stripe integration
- Bill status filtering and payment history

### 🏥 Staff Portal
- Administrative authentication
- Patient account search
- Account inactivation with reason tracking
- Inactive accounts reporting (configurable by years)
- Account management audit trails

### 📊 Reporting & Analytics
- Inactive accounts report with customizable timeframes
- Statistics on never-accessed accounts
- Detailed patient activity tracking

### 🔒 Security & Compliance
- **HIPAA-compliant** audit logging for all sensitive operations
- **PBKDF2** password hashing with encryption at rest
- **JWT-based** authentication with token expiration
- **Role-based access control** (RBAC) for Provider, Patient, and Staff
- Input validation and SQL injection prevention
- Secure session management

---

## Tech Stack

### Frontend
- **Next.js 16.0.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Turbopack** - Fast development builds

### Backend
- **Node.js** - JavaScript runtime
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM 5.22.0** - Type-safe database access
- **PostgreSQL 16** - Relational database

### Authentication & Security
- **JWT** - Stateless authentication
- **bcryptjs** - Password hashing
- **PBKDF2** - Encryption key derivation

### Payment Processing
- **Stripe API** - Payment gateway (with mock fallback for testing)

### Email
- **Nodemailer** - SMTP email delivery
- Token-based email verification

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and **npm** 8+
- **PostgreSQL** 16+ (running locally or remote)
- **Git** for version control
- **Docker** (optional, for containerized deployment)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Unified Patient Manager"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unified_patient_manager"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRATION="24h"

# Encryption (must be exactly 32 characters)
ENCRYPTION_KEY="12345678901234567890123456789012"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@hospital.com"

# Payment (Stripe)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
```

**Important Notes:**
- Generate a secure `JWT_SECRET`: `openssl rand -base64 32`
- Generate `ENCRYPTION_KEY` (32 chars): `openssl rand -hex 16`
- For Gmail SMTP, use [App Passwords](https://support.google.com/accounts/answer/185833)
- Get Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database with test data
npx prisma db seed
```

### 5. Build the Application

```bash
npm run build
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on **http://localhost:3001** (or port 3000 if available).

### Production Mode

```bash
npm run build
npm start
```

---

## Test Credentials

After seeding the database, use these credentials:

### Provider Account
- **Email:** dr.smith@hospital.com
- **Password:** password123
- **Access:** Patient records management

### Patient Account
- **Email:** jane.smith@email.com
- **Password:** password123
- **Access:** View bills and make payments

### Staff Account
- **Email:** admin@hospital.com
- **Password:** password123
- **Access:** Account management and reports



---

## Project Structure

```
Unified Patient Manager/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── bills/            # Billing endpoints
│   │   │   ├── patients/         # Patient management
│   │   │   ├── payments/         # Payment processing
│   │   │   ├── reports/          # Reporting endpoints
│   │   │   └── staff/            # Staff operations
│   │   ├── patient/              # Patient portal pages
│   │   ├── provider/             # Provider portal pages
│   │   ├── staff/                # Staff portal pages
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/               # Reusable UI components
│   ├── middleware/               # Auth and RBAC middleware
│   ├── services/                 # Business logic layer
│   │   ├── accountService.ts     # Account management
│   │   ├── billingService.ts     # Billing operations
│   │   ├── emailService.ts       # Email sending
│   │   ├── patientService.ts     # Patient operations
│   │   └── stripeService.ts      # Payment processing
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Helper utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding script
├── docs/                         # Documentation
│   ├── architecture.md           # System architecture
│   └── api.md                    # API reference
├── scripts/                      # Utility scripts
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## Database Schema

### Core Entities

- **Provider**: Healthcare providers with role and permissions
- **Patient**: Patient accounts with medical history and billing info
- **Staff**: Administrative staff with account management permissions
- **Bill**: Patient billing records with payment status
- **Payment**: Payment transactions linked to bills
- **AuditLog**: Comprehensive audit trail for all sensitive operations

### Key Relationships

- Patients have many Bills (1:N)
- Bills have many Payments (1:N)
- AuditLogs reference Providers, Patients, or Staff as actors

See `prisma/schema.prisma` for complete schema definition.

---

## API Documentation

For detailed API documentation including all endpoints, request/response schemas, and authentication requirements, see:

**[API Documentation](./docs/api.md)**

---

## Scripts

### Database Management

```bash
# Run migrations
npm run migrate

# Reset database (warning: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Development

```bash
# Start development server with Turbopack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

### Utility Scripts

```bash
# Get verification token for testing email
npm run get-token

# Delete test accounts
npm run delete-test-accounts

# List all patients
npm run list-patients

# Set patient to old date (for testing inactive reports)
npm run set-old-patient-date
```

---

## Testing

### Manual Testing Workflow

1. **Provider Flow:**
   - Login as `dr.smith@hospital.com`
   - Search for patients by name/email
   - View patient record
   - Update vitals, diagnoses, and medications
   - Verify audit log entry

2. **Patient Flow:**
   - Register new account with valid email
   - Verify email (check inbox or use get-token script)
   - Login to patient portal
   - View outstanding bills
   - Make payment (test card: `4242 4242 4242 4242`)
   - View payment history

3. **Staff Flow:**
   - Login as `admin@hospital.com`
   - Search for patient accounts
   - Inactivate account with reason
   - View inactive accounts report
   - Adjust year filter to see different results

### Test Cards (Stripe)

When using Stripe in test mode:

| Card Number         | Description           |
|---------------------|-----------------------|
| 4242 4242 4242 4242 | Successful payment    |
| 4000 0000 0000 0002 | Card declined         |
| 4000 0027 6000 3184 | Requires 3D Secure    |

Use any future expiration date, any 3-digit CVC, and any ZIP code.

---

## Deployment

### Docker Deployment

1. **Build the image:**
   ```bash
   docker build -t unified-patient-manager .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3001:3001 --env-file .env unified-patient-manager
   ```

### Production Considerations

- Set secure `JWT_SECRET` and `ENCRYPTION_KEY`
- Use production database (not localhost)
- Configure SMTP with production email service
- Use production Stripe keys
- Enable HTTPS with SSL certificate
- Set `NODE_ENV=production`
- Configure reverse proxy (nginx/Apache)
- Set up database backups
- Enable rate limiting on API routes
- Monitor application logs and performance

---

## Security Best Practices

### Implemented

✅ Password hashing with PBKDF2  
✅ JWT authentication with expiration  
✅ Role-based access control (RBAC)  
✅ Comprehensive audit logging  
✅ Email verification for patients  
✅ Input validation on all forms  
✅ SQL injection prevention via Prisma ORM  
✅ HIPAA-compliant data handling  

### Recommended for Production

- [ ] Enable HTTPS-only cookies
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable Content Security Policy (CSP)
- [ ] Set up Web Application Firewall (WAF)
- [ ] Implement MFA (Multi-Factor Authentication)
- [ ] Add IP whitelisting for admin routes
- [ ] Enable database connection pooling

---

## Troubleshooting

### Port Already in Use

If port 3001 is occupied:

```bash
# Change port in .env
NEXT_PUBLIC_APP_URL="http://localhost:3002"

# Start with custom port
PORT=3002 npm run dev
```

### Database Connection Errors

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -h localhost -p 5432

# Verify DATABASE_URL in .env matches your setup
```

### Email Verification Not Working

If SMTP fails, use the manual verification script:

```bash
npm run get-token
# Copy the verification URL and open in browser
```

### Prisma Client Out of Sync

```bash
npx prisma generate
npm run dev
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## Support

For questions or issues:

- **Email:** dev-team@hospital.com
- **Documentation:** [docs/](./docs/)
- **Issue Tracker:** GitHub Issues

---

## Architecture

For detailed system architecture, design patterns, and technical decisions, see:

**[Architecture Documentation](./docs/architecture.md)**

---

**Version:** 1.0.0  
**Last Updated:** November 29, 2025  
**Maintained By:** Development Team
