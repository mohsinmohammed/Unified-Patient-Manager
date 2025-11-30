# User Flows Documentation

## Overview

This document describes the complete user journeys for all three user types in the Unified Patient Manager application: Providers, Patients, and Staff.

---

## Provider User Flows

### Flow 1: Provider Login and Patient Search

**Goal**: Provider authenticates and searches for a patient record

**Steps**:

1. **Landing Page**
   - User navigates to `/provider/login`
   - Sees login form with email and password fields

2. **Authentication**
   - Enters credentials: `dr.smith@hospital.com` / `password123`
   - Clicks "Sign In"
   - System validates credentials and generates JWT token
   - Redirects to `/provider/dashboard`

3. **Dashboard View**
   - Sees welcome message with provider name
   - Views patient search interface
   - Search bar prominently displayed

4. **Patient Search**
   - Enters search query (name, email, or patient ID)
   - Clicks "Search"
   - **Loading State**: Shows spinner and "Searching..." text
   - System queries database for matching patients

5. **Search Results**
   - Table displays with columns: Name, Email, Phone, Date of Birth, Status, Actions
   - Each row shows patient information
   - Status badge: Green (Active) or Red (Inactive)
   - "View Record" link in Actions column

**Success Criteria**:
- ✅ Provider successfully authenticated
- ✅ Search results displayed within 2 seconds
- ✅ Audit log entry created for authentication

**Error Handling**:
- Invalid credentials: "Invalid email or password" error message
- Inactive account: "Account deactivated" error message
- No results: "No patients found matching your search" message
- Network error: "Failed to search patients" error message

---

### Flow 2: View and Edit Patient Record

**Goal**: Provider views complete patient medical history and updates information

**Prerequisite**: Provider is logged in and has search results displayed

**Steps**:

1. **Record Selection**
   - Clicks "View Record" on a patient row
   - **Loading State**: Full-screen spinner with "Loading patient record..."
   - System fetches complete patient record
   - Creates audit log entry (action: "view_patient")
   - Navigates to `/provider/patients/[id]`

2. **Record View**
   - **Header Section**: Patient name, "Back to Dashboard" button, "Edit Record" button
   - **Demographics Card**: Name, Email, Phone, Date of Birth, Address
   - **Vitals Card**: Blood Pressure, Heart Rate, Temperature, Weight, Height
   - **Medical Information Card**: Visit Summary, Diagnosis, Treatment Plan
   - **Medications Section**: List of medications with dosage and frequency
   - **Lab Results Section**: Recent lab test results

3. **Edit Mode Activation**
   - Clicks "Edit Record" button
   - Form replaces read-only view
   - All fields editable except demographics

4. **Update Information**
   - Modifies vitals (e.g., blood pressure: "125/82", heart rate: 75)
   - Updates visit summary with new notes
   - Changes diagnosis if applicable
   - Updates treatment plan
   - Adds/removes medications
   - Adds new lab results

5. **Save Changes**
   - Clicks "Save Changes"
   - **Loading State**: Button shows "Saving..."
   - System validates input
   - Updates database with new information
   - Creates audit log entry (action: "update_patient", details: changed fields)
   - Shows success message
   - Switches back to read-only view

6. **Return to Dashboard**
   - Clicks "Back to Dashboard"
   - Returns to `/provider/dashboard`
   - Previous search results still displayed

**Success Criteria**:
- ✅ Patient record loads within 1 second
- ✅ All medical fields displayed correctly
- ✅ Updates saved successfully
- ✅ Audit log entries created for view and update

**Error Handling**:
- Patient not found: Red error banner with "Patient not found"
- Save failed: Alert with "Failed to update patient record"
- Validation error: Inline field errors for invalid values
- Unauthorized: Redirect to login page

---

## Patient User Flows

### Flow 3: Patient Registration

**Goal**: New patient creates an account with email verification

**Steps**:

1. **Registration Page**
   - User navigates to `/patient/register`
   - Sees registration form

2. **Form Completion**
   - Enters personal information:
     - Email: `john.doe@email.com`
     - Password: `SecurePass123` (minimum 8 characters)
     - First Name: `John`
     - Last Name: `Doe`
     - Date of Birth: `1990-05-15`
     - Phone: `555-0101`
     - Address: `123 Main St, City, State`
   - All fields validated client-side

3. **Submit Registration**
   - Clicks "Create Account"
   - **Loading State**: Button shows "Creating Account..."
   - System validates input
   - Checks for existing account with same email
   - Hashes password with PBKDF2
   - Creates patient record (isVerified: false, isActive: true)
   - Generates verification token (32-byte hex)
   - Sends verification email via SMTP

4. **Email Verification Notice**
   - Success message: "Registration successful. Please check your email to verify your account."
   - Redirects to information page
   - Cannot login until verified

5. **Email Verification**
   - Patient receives email with subject: "Verify your email for Unified Patient Manager"
   - Email contains verification link: `https://app-url.com/api/auth/verify/[token]`
   - Clicks link in email
   - System validates token
   - Sets isVerified: true
   - Shows success page: "Email verified successfully. You can now log in to your account."

6. **First Login**
   - Navigates to `/patient/login`
   - Enters email and password
   - Successfully authenticates
   - Redirects to `/patient/dashboard`

**Success Criteria**:
- ✅ Account created successfully
- ✅ Verification email sent
- ✅ Email verified successfully
- ✅ First login successful

**Error Handling**:
- Missing fields: Client-side validation errors
- Invalid email format: "Please enter a valid email address"
- Weak password: "Password must be at least 8 characters"
- Email already exists: "Account already exists"
- Email delivery fails: Still allows verification via manual script
- Expired token: "Invalid or expired token"

---

### Flow 4: View Bills and Make Payment

**Goal**: Patient views outstanding bills and pays online

**Prerequisite**: Patient is registered, verified, and logged in

**Steps**:

1. **Dashboard Access**
   - Patient logs in successfully
   - Lands on `/patient/dashboard`
   - Sees welcome message with patient name

2. **Bills Overview**
   - **Outstanding Balance Card**: Large display showing total amount due
   - Shows number of pending bills
   - **Filter Tabs**: All Bills, Pending, Paid
   - Default view: All Bills

3. **Bills Table**
   - Columns: Description, Amount, Due Date, Status, Action
   - Each bill row displays:
     - Description (e.g., "Annual Checkup", "Lab Tests")
     - Amount formatted as currency (e.g., "$150.00")
     - Due date (e.g., "Dec 15, 2025")
     - Status badge: Yellow (Pending), Green (Paid), Red (Overdue), Gray (Failed)
     - Action button: "Pay Now" for unpaid bills

4. **Apply Filters**
   - Clicks "Pending" tab
   - **Loading State**: Brief spinner
   - Table updates to show only pending bills
   - Outstanding balance remains visible

5. **Initiate Payment**
   - Clicks "Pay Now" on a bill
   - Payment modal opens
   - Displays:
     - Bill details (description, amount, due date)
     - Stripe card input form
     - "Cancel" and "Pay $XXX.XX" buttons

6. **Enter Payment Information**
   - Enters card details:
     - Card number: `4242 4242 4242 4242` (test card)
     - Expiration: Any future date (e.g., `12/26`)
     - CVC: Any 3 digits (e.g., `123`)
     - ZIP: Any 5 digits (e.g., `12345`)
   - Stripe validates card format client-side

7. **Process Payment**
   - Clicks "Pay $150.00"
   - **Loading State**: Button shows "Processing..."
   - System creates payment intent with Stripe
   - Stripe processes payment (mock system always succeeds)
   - System updates bill status to "paid"
   - Creates payment record
   - Creates audit log entry (action: "payment_processed")
   - **Success**: Modal shows success message
   - Outstanding balance updates
   - Bill status changes to "Paid" with green badge

8. **View Payment History**
   - Clicks "Paid" tab
   - Table shows all paid bills with "Paid on [date]" in Action column
   - Can verify payment was recorded

**Success Criteria**:
- ✅ Bills displayed correctly
- ✅ Filters work as expected
- ✅ Payment processed successfully
- ✅ Balance updated in real-time
- ✅ Audit log entry created

**Error Handling**:
- No bills: "No bills found" message with checkmark icon
- Payment failed: Error message in modal, bill status set to "failed"
- Failed bill retry: "Retry Payment" button available
- Network error during load: Red error banner
- Card declined: "Your payment was declined" error message

---

## Staff User Flows

### Flow 5: Staff Login and Patient Search

**Goal**: Staff member authenticates and searches for patient accounts to manage

**Steps**:

1. **Staff Login Page**
   - User navigates to `/staff/login`
   - Sees login form
   - Blue info box displays test credentials: `admin@hospital.com` / `password123`

2. **Authentication**
   - Enters staff credentials
   - Clicks "Sign In"
   - **Loading State**: Button shows "Signing in..."
   - System validates credentials
   - Generates JWT token with role: "staff"
   - Stores token and user info in localStorage
   - Redirects to `/staff/dashboard`

3. **Staff Dashboard**
   - **Welcome Header**: "Welcome, [Staff Name]"
   - **Search Section**: Patient account search interface
   - Search input with placeholder: "Search by name, email, or ID..."
   - "Search" button

4. **Search for Patient**
   - Enters query: "John Doe"
   - Clicks "Search"
   - **Loading State**: Button shows "Searching..."
   - System queries patients table
   - Returns matching results

5. **View Search Results**
   - Table displays with columns: Patient, Email, Phone, Status, Last Access, Actions
   - Patient column shows:
     - Full name
     - Patient ID (truncated)
   - Status badges:
     - Green "Active" for active accounts
     - Red "Inactive" for inactive accounts
     - Yellow "Unverified" if not email verified
   - Last Access shows date or "Never"
   - Actions: "Inactivate" button (active patients only)

**Success Criteria**:
- ✅ Staff successfully authenticated
- ✅ Search returns accurate results
- ✅ All patient information displayed correctly

**Error Handling**:
- Invalid credentials: "Invalid email or password"
- Inactive staff account: "Account deactivated"
- No results: Empty state with icon and "No patients found"
- Network error: Alert with error message

---

### Flow 6: Inactivate Patient Account

**Goal**: Staff member inactivates an inactive patient account with reason documentation

**Prerequisite**: Staff is logged in with search results displayed

**Steps**:

1. **Select Patient**
   - Identifies patient to inactivate from search results
   - Verifies patient status is "Active"
   - Clicks "Inactivate" button

2. **Confirmation Modal Opens**
   - Modal displays with:
     - Warning icon
     - Header: "Inactivate Patient Account"
     - Yellow warning banner: "This will prevent the patient from logging in..."
     - Patient details: Name, Email
     - Reason textarea (optional)
     - "Cancel" and "Inactivate Account" buttons

3. **Enter Reason**
   - Staff types reason: "Account closure requested by patient via phone"
   - Reason provides audit trail for compliance

4. **Confirm Inactivation**
   - Clicks "Inactivate Account"
   - **Loading State**: Button disabled, shows "Inactivating..."
   - System validates staff authentication
   - Updates patient record (isActive: false)
   - Creates audit log entry:
     - action: "inactivate_account"
     - actorType: "Staff"
     - actorId: staff ID
     - patientId: patient ID
     - details: {reason, patientEmail, patientName}
     - ipAddress: request IP
     - userAgent: browser info
   - Modal closes
   - Success callback triggers

5. **View Updated Results**
   - Patient row updates automatically
   - Status badge changes to Red "Inactive"
   - Action column shows "Already Inactive" (gray text)
   - Cannot be reactivated from UI

**Success Criteria**:
- ✅ Account inactivated successfully
- ✅ Audit log entry created with reason
- ✅ UI updates to reflect new status
- ✅ Patient can no longer log in

**Error Handling**:
- Patient not found: Modal shows error, closes
- Patient already inactive: Error response, modal closes
- Network error: Alert with error message
- Unauthorized: Redirect to login

---

### Flow 7: View Inactive Accounts Report

**Goal**: Staff generates report of patient accounts not accessed for 7+ years

**Prerequisite**: Staff is logged in

**Steps**:

1. **Navigate to Reports**
   - Clicks "Reports" in navigation menu
   - System redirects from `/staff/reports` to `/staff/reports/inactive-accounts`

2. **Report Page Loads**
   - **Loading State**: Full-screen spinner with "Loading report..."
   - System queries patients with lastAccessDate calculation
   - Default filter: 7 years

3. **View Report Header**
   - Title: "Inactive Accounts Report"
   - Subtitle: "Patient accounts not accessed for 7+ years"
   - "Back to Dashboard" link
   - Year filter dropdown: 1, 2, 3, 5, 7, 10 years

4. **Statistics Cards**
   - **Total Inactive**: Count of accounts (gray card)
   - **Never Accessed**: Count of accounts never logged in (orange card)
   - **Oldest Inactive**: Name and last access date

5. **Accounts Table**
   - Columns: Patient, Email, Account Status, Last Access, Created, Inactive Duration
   - Each row shows:
     - Patient name and ID
     - Email address
     - Status badge (Active/Inactive)
     - Last access date or "Never"
     - Account creation date
     - Inactive duration badge (e.g., "8.0 years" in orange)

6. **Adjust Filter**
   - Changes dropdown to "10 years"
   - **Loading State**: Brief spinner
   - Report refreshes with new criteria
   - Statistics update
   - Table updates to show only 10+ year inactive accounts
   - May show zero results if no accounts match

7. **Empty State** (if no results)
   - Green checkmark icon
   - "No inactive accounts found"
   - "All patient accounts have been accessed within the last X years"

8. **Return to Dashboard**
   - Clicks "Back to Dashboard"
   - Navigates to `/staff/dashboard`

**Success Criteria**:
- ✅ Report loads with accurate data
- ✅ Statistics calculated correctly
- ✅ Filter changes update report
- ✅ Empty state displays when no results

**Error Handling**:
- Database query fails: Red error banner
- Invalid year filter: Default to 7 years
- Unauthorized: Redirect to login

---

## Common Patterns

### Navigation Flow

**Global Navigation** (Layout component):

- **Provider**: Dashboard, Patients (dropdown - implicit via search)
- **Patient**: Dashboard only (bills integrated on dashboard)
- **Staff**: Dashboard, Reports

All users have logout button in header.

### Error Recovery Patterns

1. **Network Failures**:
   - Show error message
   - Provide "Try Again" action
   - Return to previous stable state

2. **Authentication Failures**:
   - Clear localStorage
   - Redirect to appropriate login page
   - Show "Session expired" message

3. **Validation Errors**:
   - Display inline field errors
   - Keep form data populated
   - Focus first error field

4. **Empty States**:
   - Friendly icon (checkmark, inbox, magnifying glass)
   - Explanatory message
   - Suggested action if applicable

### Loading States

**Patterns Used**:

1. **Full Page Loader**: Spinner with descriptive text (e.g., "Loading patient record...")
2. **Button Loader**: Disabled state with text change (e.g., "Saving..." instead of "Save")
3. **Inline Loader**: Small spinner next to content being refreshed
4. **Skeleton Screens**: (Not currently implemented, recommended enhancement)

### Session Management

**Token Handling**:
- JWT stored in localStorage
- Validated on every protected API request
- Expires after 24 hours
- User redirected to login on expiration

**Logout Flow**:
- User clicks "Logout" or "Sign Out"
- localStorage.clear() removes all data
- Redirect to appropriate login page
- No API call required (stateless JWT)

---

## User Flow Diagrams

### Provider Flow Diagram
```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   Search    │────▶│   Results   │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ View Record │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Edit Record │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Save     │
                    └─────────────┘
```

### Patient Flow Diagram
```
┌─────────────┐     ┌─────────────┐
│  Register   │────▶│   Verify    │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  Dashboard  │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ View Bills  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Pay Bill    │
                    └─────────────┘
```

### Staff Flow Diagram
```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ├────────────────────┐
       │                    │
       ▼                    ▼
┌─────────────┐     ┌─────────────┐
│   Search    │     │   Reports   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Inactivate  │     │   Filter    │
└─────────────┘     └─────────────┘
```

---

## Accessibility Considerations

### Keyboard Navigation
- All interactive elements accessible via Tab key
- Enter key activates buttons and links
- Esc key closes modals
- Focus indicators visible on all elements

### Screen Readers
- Semantic HTML elements used throughout
- ARIA labels on complex components
- Loading states announced
- Error messages announced
- Success messages announced

### Visual Design
- High contrast text (WCAG AA compliant)
- Focus indicators clearly visible
- Color not sole indicator of status (icons + text)
- Responsive design for all screen sizes

---

**Last Updated**: November 29, 2025  
**Version**: 1.0.0  
**Maintained By**: Development Team
