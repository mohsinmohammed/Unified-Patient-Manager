# IMPL_PLAN: Employee Efficiency & Patient Service Web App

## Branch
`1-employee-efficiency-patient-Service`

## IMPL_PLAN Path
`specs/1-employee-efficiency-patient-experience/speckit.plan.IMPL_PLAN.md`

## Technical Context
- **Framework**: Next.js (React-based, SSR/SSG, API routes)
- **Deployment**: Docker container (multi-stage build, production-ready)
- **Mobile Responsiveness**: CSS-in-JS (styled-components or Tailwind), viewport meta, responsive layouts
- **Security**: Auth (JWT, OAuth), HTTPS, role-based access, audit logging, Stripe for payments, HIPAA compliance
- **Data**: Patient, Provider, Staff entities; secure CRUD; audit logs; inactivity tracking
- **Testing**: Unit, integration, e2e (Jest, Cypress)

## Constitution Check
- Spec and checklist are complete, testable, and technology-agnostic
- No [NEEDS CLARIFICATION] markers
- All acceptance criteria and edge cases defined
- Implementation notes align with Next.js, Docker, and mobile requirements

## Gates (Resolved)
- **Spec Quality**: All mandatory sections complete
- **Requirements**: Testable, unambiguous, measurable
- **Feature Readiness**: Acceptance criteria, user scenarios, scope, dependencies

## Phase 1: Foundation & Core Flows
1. **Next.js App Scaffold**
   - Create Next.js app, configure TypeScript
   - Set up Dockerfile (multi-stage build)
   - Add linting, formatting, CI config
2. **Auth & Roles**
   - Implement JWT/OAuth login for Providers, Patients, Staff
   - Role-based access control (RBAC)
   - Email verification for patient registration
3. **Core Entities & API**
   - Patient, Provider, Staff models (TypeScript, Prisma/ORM)
   - API routes for CRUD, search, audit logging
   - Secure endpoints, HIPAA compliance
4. **UI Foundation**
   - Responsive layout, navigation, role-based dashboards
   - Mobile-first design, accessibility

## Phase 2: Key Flows & Integrations
1. **Provider Flows**
   - Search/view/update patient records
   - Audit logging for all actions
2. **Patient Flows**
   - Registration, email verification
   - View bills, Stripe payment integration
   - Handle failed payments, duplicate accounts
3. **Staff Flows**
   - Inactivate patient accounts
   - List inactive accounts (>7 years)
   - Audit logs for all actions
4. **Testing & Compliance**
   - Unit/integration/e2e tests
   - Security, HIPAA, and data retention checks

## Artifacts to Generate
- `specs/1-employee-efficiency-patient-experience/speckit.plan.IMPL_PLAN.md` (this plan)
- `specs/1-employee-efficiency-patient-experience/Dockerfile` (multi-stage, Next.js)
- `specs/1-employee-efficiency-patient-experience/next.config.js` (Next.js config)
- `specs/1-employee-efficiency-patient-experience/README.md` (setup, run, test, deploy)

---

**Best Practices**
- Use Next.js API routes for backend logic
- Use environment variables for secrets
- Use HTTPS, secure cookies, and RBAC
- Use Stripe test keys for payments
- Use responsive design (mobile-first)
- Log all critical actions for audit
- Use multi-stage Docker builds for small images
- Write tests for all critical flows
