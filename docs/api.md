# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Token expires after 24 hours (configurable via `JWT_EXPIRATION` env var).

---

## Authentication Endpoints

### Provider Login
**POST** `/api/auth/provider/login`

Authenticate healthcare provider.

**Request Body:**
```json
{
  "email": "dr.smith@hospital.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "provider": {
    "id": "uuid",
    "email": "dr.smith@hospital.com",
    "firstName": "Sarah",
    "lastName": "Smith",
    "role": "Doctor",
    "permissions": ["view_patients", "update_records"]
  }
}
```

**Errors:**
- 401: Invalid email or password
- 403: Account deactivated

---

### Patient Registration
**POST** `/api/auth/patient/register`

Register new patient account.

**Request Body:**
```json
{
  "email": "john.doe@email.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "phone": "555-0101",
  "address": "123 Main St, City, State"
}
```

**Response (201):**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "patient": {
    "id": "uuid",
    "email": "john.doe@email.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false
  }
}
```

**Errors:**
- 400: Missing required fields or invalid email format
- 409: Account already exists

---

### Email Verification
**GET** `/api/auth/verify/[token]`

Verify patient email address.

**Parameters:**
- `token` (path): Verification token from email

**Response (200):**
```json
{
  "message": "Email verified successfully. You can now log in to your account.",
  "verified": true
}
```

**Errors:**
- 404: Invalid or expired token

---

### Patient Login
**POST** `/api/auth/patient/login`

Authenticate patient.

**Request Body:**
```json
{
  "email": "john.doe@email.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "patient": {
    "id": "uuid",
    "email": "john.doe@email.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "phone": "555-0101",
    "isVerified": true
  }
}
```

**Errors:**
- 401: Invalid email or password
- 403: Account deactivated or not verified

---

### Staff Login
**POST** `/api/auth/staff/login`

Authenticate hospital staff.

**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "staff": {
    "id": "uuid",
    "email": "admin@hospital.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "Administrator",
    "permissions": ["view_patients", "inactivate_accounts", "view_reports"]
  }
}
```

**Errors:**
- 401: Invalid email or password
- 403: Account deactivated

---

## Patient Management Endpoints

### Search Patients
**GET** `/api/patients/search`

Search for patients by name, email, or ID.

**Authorization:** Provider or Staff only

**Query Parameters:**
- `q` (string): Search query
- `limit` (number, optional): Max results (default: 50)

**Response (200):**
```json
{
  "patients": [
    {
      "id": "uuid",
      "email": "john.doe@email.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-05-15",
      "phone": "555-0101",
      "isActive": true,
      "lastAccessDate": "2025-11-29T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Get Patient Record
**GET** `/api/patients/[id]`

Retrieve complete patient record.

**Authorization:** Provider only

**Parameters:**
- `id` (path): Patient UUID

**Response (200):**
```json
{
  "id": "uuid",
  "email": "john.doe@email.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "phone": "555-0101",
  "address": "123 Main St",
  "vitals": {
    "bloodPressure": "120/80",
    "heartRate": 72,
    "temperature": 98.6
  },
  "visitSummary": "Annual checkup...",
  "diagnosis": "Healthy",
  "treatment": "None required",
  "labResults": [...],
  "medications": [...],
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-11-29T00:00:00.000Z"
}
```

**Errors:**
- 401: Unauthorized
- 404: Patient not found

---

### Update Patient Record
**PUT** `/api/patients/[id]`

Update patient medical record.

**Authorization:** Provider only

**Parameters:**
- `id` (path): Patient UUID

**Request Body:**
```json
{
  "vitals": {
    "bloodPressure": "125/82",
    "heartRate": 75,
    "temperature": 98.8
  },
  "visitSummary": "Follow-up visit...",
  "diagnosis": "Hypertension",
  "treatment": "Prescribed medication",
  "medications": [
    {
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "Once daily"
    }
  ]
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "john.doe@email.com",
  "firstName": "John",
  "lastName": "Doe",
  ...updatedFields
}
```

**Errors:**
- 401: Unauthorized
- 404: Patient not found

---

## Billing Endpoints

### Get Patient Bills
**GET** `/api/bills`

Retrieve bills for authenticated patient.

**Authorization:** Patient only

**Query Parameters:**
- `status` (string, optional): Filter by status (`pending`, `paid`)

**Response (200):**
```json
{
  "bills": [
    {
      "id": "uuid",
      "patientId": "uuid",
      "amount": 150.00,
      "status": "pending",
      "description": "Annual Checkup",
      "dueDate": "2025-12-15T00:00:00.000Z",
      "paidAt": null,
      "createdAt": "2025-11-01T00:00:00.000Z"
    }
  ],
  "outstandingBalance": 150.00,
  "count": 1
}
```

---

### Process Payment
**POST** `/api/payments`

Process bill payment with Stripe.

**Authorization:** Patient only

**Request Body:**
```json
{
  "billId": "uuid",
  "paymentMethodId": "pm_card_1234"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "paid",
  "amount": 150.00,
  "paidAt": "2025-11-29T12:00:00.000Z",
  "paymentMethod": "credit_card"
}
```

**Errors:**
- 400: Bill already paid or payment failed
- 404: Bill not found

---

## Staff Operations Endpoints

### Search Patients (Staff)
**GET** `/api/staff/patients/search`

Search patients for account management.

**Authorization:** Staff only

**Query Parameters:**
- `q` (string): Search query
- `limit` (number, optional): Max results (default: 50)

**Response (200):**
```json
{
  "patients": [
    {
      "id": "uuid",
      "email": "john.doe@email.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-05-15",
      "phone": "555-0101",
      "isActive": true,
      "isVerified": true,
      "lastAccessDate": "2025-11-29T00:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Inactivate Patient Account
**POST** `/api/staff/patients/[id]/inactivate`

Deactivate a patient account.

**Authorization:** Staff only

**Parameters:**
- `id` (path): Patient UUID

**Request Body:**
```json
{
  "reason": "Account closure requested by patient"
}
```

**Response (200):**
```json
{
  "message": "Patient account has been inactivated successfully",
  "patient": {
    "id": "uuid",
    "email": "john.doe@email.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": false,
    "updatedAt": "2025-11-29T12:00:00.000Z"
  }
}
```

**Errors:**
- 400: Account already inactive
- 404: Patient not found

---

## Reporting Endpoints

### Inactive Accounts Report
**GET** `/api/reports/inactive-accounts`

Get list of accounts inactive for specified years.

**Authorization:** Staff only

**Query Parameters:**
- `years` (number, optional): Minimum inactive years (default: 7)

**Response (200):**
```json
{
  "accounts": [
    {
      "id": "uuid",
      "email": "old.patient@email.com",
      "firstName": "Old",
      "lastName": "Patient",
      "lastAccessDate": "2017-11-30T00:00:00.000Z",
      "createdAt": "2015-01-01T00:00:00.000Z",
      "isActive": true
    }
  ],
  "statistics": {
    "totalInactive": 1,
    "neverAccessed": 0,
    "oldestAccount": {
      "email": "old.patient@email.com",
      "name": "Old Patient",
      "lastAccess": "2017-11-30T00:00:00.000Z"
    }
  },
  "criteria": {
    "minimumYears": 7,
    "cutoffDate": "2018-11-29T00:00:00.000Z"
  }
}
```

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error message description",
  "details": {
    "field": "Specific validation error"
  }
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal server error |

---

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## Audit Logging

All sensitive operations are automatically logged:
- Patient record access
- Patient record updates
- Account inactivation
- Payment processing
- Authentication attempts

Audit logs include:
- Action performed
- Actor (user ID and type)
- Target (patient ID if applicable)
- IP address
- User agent
- Timestamp
- Additional details (JSON)

---

## Security Considerations

### HIPAA Compliance
- All patient data access is logged
- PHI (Protected Health Information) is encrypted
- Access controls enforced via RBAC
- Secure transmission (HTTPS required in production)

### Authentication
- JWT tokens expire after 24 hours
- Passwords hashed with PBKDF2
- Email verification required for patients
- Account status checked on every login

### Authorization
- Role-based access control (Provider, Patient, Staff)
- Middleware validates permissions
- Cross-account access prevented

---

**API Version**: 1.0.0  
**Last Updated**: November 29, 2025  
**Contact**: dev-team@hospital.com
