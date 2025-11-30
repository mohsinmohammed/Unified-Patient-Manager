# Unified Patient Manager Documentation

This documentation covers the Unified Patient Manager web application, designed to improve employee efficiency, enhance patient experiences, and streamline medical care delivery.

## Overview
- Built with Next.js
- Docker container deployment
- Responsive and mobile-ready design
- HIPAA-compliant data handling

## Key Features
- Centralized access to patient data
- Secure access/update for healthcare providers (Doctors, Nurses, Hospital Staff)
- Patient account creation and bill payment (check/credit card via Stripe)
- Hospital staff can inactivate accounts and list inactive accounts (not accessed for 7+ years)
- Audit logging and compliance

## Entities
- Patient: Personal info, vitals, visit summary, diagnosis, treatment, lab results, medications, billing, account status
- Provider: Role, access permissions
- Hospital Staff: Role, access permissions
- Bill: Amount, status, payment method
- Audit Log: Actor, action, timestamp, patient ID, IP address
- Inactive Account: Last access date older than 7 years

## Deployment
- See Dockerfile and Next.js configuration for setup instructions

## Compliance
- All data storage, access, transmission, and retention follow HIPAA rules and regulations

## Additional Docs
- See `specs/1-employee-efficiency-patient-experience/spec.md` for full specification
- See `specs/1-employee-efficiency-patient-experience/checklists/requirements.md` for requirements checklist
