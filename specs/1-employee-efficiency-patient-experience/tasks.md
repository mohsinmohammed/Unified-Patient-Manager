# Tasks: Employee Efficiency & Patient Service Web App

**Input**: Design documents from `/specs/1-employee-efficiency-patient-experience/`
**Prerequisites**: spec.md, speckit.plan.IMPL_PLAN.md

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are NOT included in this plan.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

**Web app structure**: Frontend and backend in same Next.js app
- Frontend: `src/app/`, `src/components/`, `src/styles/`
- API: `src/app/api/`
- Models: `src/models/`
- Services: `src/services/`
- Utils: `src/utils/`
- Config: Root directory
- Docs: `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Next.js structure

- [X] T001 Create Next.js project with TypeScript and configure project structure
- [X] T002 [P] Create Dockerfile with multi-stage build for production deployment in root directory
- [X] T003 [P] Configure next.config.js with production settings and mobile optimization
- [X] T004 [P] Setup ESLint and Prettier configuration files
- [X] T005 [P] Create docker-compose.yml for local development environment
- [X] T006 [P] Setup environment variables template (.env.example) for secrets management
- [X] T007 [P] Configure Tailwind CSS for responsive mobile-first design in tailwind.config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create database schema with Prisma for Patient, Provider, Staff, Bill, AuditLog entities in prisma/schema.prisma
- [X] T009 [P] Implement authentication middleware with JWT in src/middleware/auth.ts
- [X] T010 [P] Implement role-based access control (RBAC) middleware in src/middleware/rbac.ts
- [X] T011 [P] Create audit logging utility with IP tracking in src/utils/auditLog.ts
- [X] T012 [P] Setup email service for verification in src/services/emailService.ts
- [X] T013 Create base API error handling middleware in src/middleware/errorHandler.ts
- [X] T014 [P] Create responsive layout component with navigation in src/components/Layout.tsx
- [X] T015 [P] Implement HIPAA-compliant encryption utilities in src/utils/encryption.ts
- [X] T016 [P] Create Stripe payment service wrapper in src/services/stripeService.ts
- [X] T017 Setup environment configuration management in src/config/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Provider Access/Update Patient Records (Priority: P1) 🎯 MVP

**Goal**: Healthcare providers can log in, search for patients, view and update patient records securely

**Independent Test**: Provider can log in, search for a patient by name or ID, view complete patient record (including vitals, visit summary, diagnosis, treatment, lab results, medications), and update any field with changes being saved and logged

### Implementation for User Story 1

- [X] T018 [P] [US1] Create Patient model with all medical fields in src/models/Patient.ts
- [X] T019 [P] [US1] Create Provider model with role and permissions in src/models/Provider.ts
- [X] T020 [US1] Implement PatientService with CRUD and search operations in src/services/patientService.ts
- [X] T021 [US1] Create API route for provider authentication POST /api/auth/provider/login in src/app/api/auth/provider/login/route.ts
- [X] T022 [P] [US1] Create API route for patient search GET /api/patients/search in src/app/api/patients/search/route.ts
- [X] T023 [P] [US1] Create API route for retrieving patient record GET /api/patients/[id] in src/app/api/patients/[id]/route.ts
- [X] T024 [P] [US1] Create API route for updating patient record PUT /api/patients/[id] in src/app/api/patients/[id]/route.ts
- [X] T025 [US1] Create provider login page at src/app/provider/login/page.tsx
- [X] T026 [US1] Create provider dashboard with search functionality at src/app/provider/dashboard/page.tsx
- [X] T027 [US1] Create patient record view component in src/components/PatientRecordView.tsx
- [X] T028 [US1] Create patient record edit form component in src/components/PatientRecordEdit.tsx
- [X] T029 [US1] Add audit logging to all patient access and update operations in PatientService
- [X] T030 [US1] Add validation for patient record updates with error handling
- [X] T031 [US1] Implement non-existent patient error handling in patient API routes

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Patient Account Creation & Bill Payment (Priority: P2)

**Goal**: Patients can register accounts with email verification, view their bills, and make payments via credit card

**Independent Test**: Patient can register with email/password, receive and complete email verification, log in, view outstanding bills, and successfully pay using Stripe

### Implementation for User Story 2

- [X] T032 [P] [US2] Create Bill model with amount, status, payment method in src/models/Bill.ts
- [X] T033 [US2] Implement BillingService with view and payment operations in src/services/billingService.ts
- [X] T034 [US2] Create API route for patient registration POST /api/auth/patient/register in src/app/api/auth/patient/register/route.ts
- [X] T035 [P] [US2] Create API route for email verification GET /api/auth/verify/[token] in src/app/api/auth/verify/[token]/route.ts
- [X] T036 [P] [US2] Create API route for patient login POST /api/auth/patient/login in src/app/api/auth/patient/login/route.ts
- [X] T037 [P] [US2] Create API route for retrieving patient bills GET /api/bills in src/app/api/bills/route.ts
- [X] T038 [P] [US2] Create API route for Stripe payment processing POST /api/payments in src/app/api/payments/route.ts
- [X] T039 [US2] Create patient registration page at src/app/patient/register/page.tsx
- [X] T040 [US2] Create email verification success page at src/app/verify/page.tsx
- [X] T041 [US2] Create patient login page at src/app/patient/login/page.tsx
- [X] T042 [US2] Create patient dashboard with bill listing at src/app/patient/dashboard/page.tsx
- [X] T043 [US2] Create bill payment component with Stripe integration in src/components/BillPayment.tsx
- [X] T044 [US2] Add duplicate account prevention logic to registration API
- [X] T045 [US2] Implement failed payment error handling and user notification
- [X] T046 [US2] Add audit logging for patient account creation and payment actions

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Hospital Staff Inactivate Patient Account (Priority: P3)

**Goal**: Hospital staff can search for patients and inactivate their accounts, revoking access

**Independent Test**: Staff can log in, search for a patient, inactivate their account, and verify patient can no longer log in

### Implementation for User Story 3

- [X] T047 [P] [US3] Create Staff model with role and permissions in src/models/Staff.ts
- [X] T048 [US3] Implement AccountManagementService with inactivation logic in src/services/accountService.ts
- [X] T049 [US3] Create API route for staff authentication POST /api/auth/staff/login in src/app/api/auth/staff/login/route.ts
- [X] T050 [P] [US3] Create API route for patient account inactivation PUT /api/patients/[id]/inactivate in src/app/api/patients/[id]/inactivate/route.ts
- [X] T051 [US3] Create staff login page at src/app/staff/login/page.tsx
- [X] T052 [US3] Create staff dashboard with patient search at src/app/staff/dashboard/page.tsx
- [X] T053 [US3] Create account inactivation confirmation modal in src/components/InactivateAccountModal.tsx
- [X] T054 [US3] Update authentication middleware to check account active status
- [X] T055 [US3] Add audit logging for account inactivation actions

**Checkpoint**: All three priority user stories should now be independently functional

---

## Phase 6: User Story 4 - Staff List Inactive Accounts (Priority: P4)

**Goal**: Hospital staff can retrieve a filtered list of patient accounts not accessed for more than 7 years

**Independent Test**: Staff can request inactive accounts report and see list of accounts with last access date older than 7 years, or see empty state if none exist

### Implementation for User Story 4

- [X] T056 [P] [US4] Add lastAccessDate field to Patient model in src/models/Patient.ts
- [X] T057 [US4] Implement inactive accounts query logic in AccountManagementService in src/services/accountService.ts
- [X] T058 [P] [US4] Create API route for inactive accounts listing GET /api/reports/inactive-accounts in src/app/api/reports/inactive-accounts/route.ts
- [X] T059 [US4] Create inactive accounts report page at src/app/staff/reports/inactive-accounts/page.tsx
- [X] T060 [US4] Create inactive accounts table component in src/components/InactiveAccountsTable.tsx
- [X] T061 [US4] Add empty state handling when no accounts meet 7-year criteria
- [X] T062 [US4] Update middleware to track lastAccessDate on every patient login

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and documentation

- [X] T063 [P] Create architecture documentation in docs/architecture.md
- [X] T064 [P] Create API documentation with all endpoints in docs/api.md
- [X] T065 [P] Create security and HIPAA compliance documentation in docs/security.md
- [X] T066 [P] Create Docker deployment guide in docs/deployment.md
- [X] T067 [P] Create mobile/responsive design notes in docs/mobile.md
- [X] T068 [P] Create user flows documentation in docs/user-flows.md
- [X] T069 [P] Create comprehensive README.md in root directory
- [X] T070 [P] Add loading states to all async operations across components
- [X] T071 [P] Implement consistent error messages and toast notifications
- [ ] T072 Performance optimization: add caching to frequently accessed patient records
- [ ] T073 Performance optimization: implement code splitting for route-based lazy loading
- [ ] T074 [P] Security hardening: add rate limiting to all API endpoints
- [ ] T075 [P] Security hardening: implement HTTPS-only cookies for authentication
- [ ] T076 Add accessibility features (ARIA labels, keyboard navigation) to all components
- [ ] T077 [P] Create CI/CD pipeline configuration for automated testing and deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independently testable)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses Patient model from US1 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Extends US3 functionality but independently testable

### Within Each User Story

- Models before services
- Services before API routes
- API routes before UI pages
- Core pages before specialized components
- Core implementation before validation/logging
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (7 tasks)
- All Foundational tasks marked [P] can run in parallel (9 tasks)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within User Story 1: T018-T019 parallel, T022-T024 parallel
- Within User Story 2: T032 solo, T035-T038 parallel after T034
- Within User Story 3: T047 solo, T050 can be parallel with frontend work
- Within User Story 4: T056 and T058 can be parallel with T059-T060
- All Phase 7 documentation tasks can run in parallel (7 tasks)

---

## Parallel Example: User Story 1

```bash
# Launch models in parallel:
Task T018: "Create Patient model with all medical fields in src/models/Patient.ts"
Task T019: "Create Provider model with role and permissions in src/models/Provider.ts"

# After PatientService (T020) complete, launch API routes in parallel:
Task T022: "Create API route for patient search GET /api/patients/search"
Task T023: "Create API route for retrieving patient record GET /api/patients/[id]"
Task T024: "Create API route for updating patient record PUT /api/patients/[id]"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (7 tasks)
2. Complete Phase 2: Foundational (10 tasks) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (14 tasks)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Provider can log in
   - Provider can search patients
   - Provider can view patient records (all medical fields)
   - Provider can update patient records
   - All actions are logged with IP address
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational (17 tasks) → Foundation ready
2. Add User Story 1 (14 tasks) → Test independently → Deploy/Demo (MVP! - Core provider functionality)
3. Add User Story 2 (15 tasks) → Test independently → Deploy/Demo (Patient self-service added)
4. Add User Story 3 (9 tasks) → Test independently → Deploy/Demo (Staff account management added)
5. Add User Story 4 (7 tasks) → Test independently → Deploy/Demo (Compliance reporting added)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (17 tasks, ~2-3 days)
2. **Once Foundational is done:**
   - Developer A: User Story 1 (14 tasks) - Provider functionality
   - Developer B: User Story 2 (15 tasks) - Patient functionality
   - Developer C: User Story 3 (9 tasks) - Staff functionality
   - Developer D: User Story 4 (7 tasks) - Reporting
3. Stories complete and integrate independently
4. All developers: Phase 7 Polish in parallel

---

## Summary

- **Total Tasks**: 77
- **Setup Phase**: 7 tasks
- **Foundational Phase**: 10 tasks (BLOCKING)
- **User Story 1 (P1)**: 14 tasks - Provider access/update records
- **User Story 2 (P2)**: 15 tasks - Patient registration and billing
- **User Story 3 (P3)**: 9 tasks - Staff account inactivation
- **User Story 4 (P4)**: 7 tasks - Inactive accounts reporting
- **Polish Phase**: 15 tasks
- **Parallel Opportunities**: 23+ tasks can run in parallel across phases
- **Independent Test Criteria**: Each user story has clear acceptance criteria
- **MVP Scope**: Setup + Foundational + User Story 1 = 31 tasks

---

## Notes

- [P] tasks = different files, no dependencies within same phase
- [Story] label (US1, US2, US3, US4) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are NOT included as they were not explicitly requested in the specification
- All tasks follow strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
