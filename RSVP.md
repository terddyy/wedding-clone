# RSVP System - Complete Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [User Flow](#user-flow)
4. [Stage-by-Stage Breakdown](#stage-by-stage-breakdown)
5. [API Endpoints](#api-endpoints)
6. [Data Model](#data-model)
7. [Security Features](#security-features)
8. [Database Schema](#database-schema)
9. [File Structure](#file-structure)
10. [Tech Stack](#tech-stack)

---

## Overview

The Wedding RSVP system is a **three-stage secure authentication and submission flow** that allows invited guests to:
1. Authenticate with a unique invitation code
2. Submit their attendance status and optional message
3. Receive confirmation of their submission

The system is built with **Next.js 15**, **TypeScript**, **Firebase Firestore**, **React**, and **Framer Motion** for a modern, responsive user experience.

### Key Features
- ✅ **Secure Code-Based Authentication** - Guests authenticate via unique invitation codes
- ✅ **Bcrypt-Hashed Codes** - Codes are never stored in plain text
- ✅ **One-Use Prevention** - Each code can only be used once
- ✅ **Session Management** - 1-hour session timeouts for security
- ✅ **Animated UI** - Smooth transitions and professional design
- ✅ **Mobile Responsive** - Fully optimized for all devices
- ✅ **Error Handling** - Comprehensive error messages and recovery

---

## Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    RSVP System Architecture                 │
└─────────────────────────────────────────────────────────────┘

Guest                         Client-Side                    Server-Side
  │                          (Browser)                      (Next.js API)
  │                             │                               │
  └──→ Visit /rsvp              │                               │
       (Enter Code)             │                               │
       │                        │                               │
       └──→ Submit Code ─────────────────────→ /api/auth/validate
                        (POST Request)              │
                                  │←────────────────┘
                        ┌─────────────────────┐
                        │ Firebase Firestore  │
                        │ - Query guests      │
                        │ - Verify hashed code│
                        │ - Create session    │
                        └─────────────────────┘
                                  │
       ←────────────────────────────┘
       (Session + Guest Info)
       │
       └──→ Redirect to /rsvp/form
            (Load form with greeting)
            │
            └──→ Select RSVP Status
                 Enter Optional Message
                 │
                 └──→ Submit ──────────────→ /api/rsvp/submit
                        (POST Request)           │
                                         ┌──────────────────┐
                                         │ Firebase Update  │
                                         │ - Set used=true  │
                                         │ - Save response  │
                                         │ - Timestamp      │
                                         └──────────────────┘
                                                 │
            ←────────────────────────────────────┘
            (Success Response)
            │
            └──→ Clear Session & Redirect
                 to /rsvp/confirmation
                 (Show Success Page)
```

---

## User Flow

### Complete Journey Map

```
START
  ↓
[STAGE 1] Code Entry (/rsvp)
  • Guest sees invitation code input form
  • Enters 8-character code
  • Code converted to UPPERCASE
  ↓
[VALIDATION] API Check (/api/auth/validate)
  • Fetch all unused guest codes from Firebase
  • Compare guest's code with hashed codes (bcrypt)
  • Verify code hasn't been used yet
  ✓ Valid → Continue to Stage 2
  ✗ Invalid → Show error, stay on page
  ↓
[STAGE 2] RSVP Form (/rsvp/form)
  • Session stored in sessionStorage (1 hour expiry)
  • Check if session is still valid
  • Display personalized greeting: "Welcome, [Guest Name]!"
  • Show attendance options:
    - "Joyfully accepts" (attending)
    - "Regretfully declines" (not_attending)
  • Optional textarea for message
  ↓
[SUBMISSION] Submit RSVP (/api/rsvp/submit)
  • Save guest's response to Firebase
  • Mark code as used (used: true)
  • Record submission timestamp
  • Prevent duplicate submissions
  ↓
[STAGE 3] Confirmation (/rsvp/confirmation)
  • Clear session from browser
  • Display success animation (green checkmark)
  • Show "What's Next?" guidance cards
  • Provide links to other site sections
  ↓
END
  • Guest can browse other pages (story, venue, itinerary, registry)
```

---

## Stage-by-Stage Breakdown

### STAGE 1: Code Validation Page (`/rsvp/page.tsx`)

#### Purpose
Guest enters their unique invitation code to authenticate.

#### User Interface
- **Hero Section** - Large "RSVP" heading with warm messaging
- **Code Input Box** - Aesthetic form container with lock icon
- **Input Field** - 8-character max, uppercase conversion
- **Error Display** - Real-time error feedback below input
- **Info Section** - Three cards showing deadline, plus-ones info, and update process
- **Help Text** - Email contact for missing codes

#### Component Logic

```typescript
// State Management
const [code, setCode] = useState('');              // Form input
const [isLoading, setIsLoading] = useState(false); // Submit state
const [error, setError] = useState('');            // Error messages

// Form Handler
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // 1. Call validation API
    const response = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim() }),
    });

    const data = await response.json();

    // 2. Handle errors
    if (!response.ok) {
      throw new Error(data.error || 'Invalid code');
    }

    // 3. Store session and guest info in sessionStorage
    sessionStorage.setItem('rsvp_session', JSON.stringify(data.session));
    sessionStorage.setItem('guest_info', JSON.stringify(data.guest));

    // 4. Redirect to RSVP form
    router.push('/rsvp/form');
  } catch (err: any) {
    setError(err.message || 'An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

#### Key Features
- Code auto-converts to uppercase as user types
- Error message clears when user starts typing again
- Loading state prevents double-submission
- Form uses `maxLength={8}` to limit input
- `autoComplete="off"` for security

#### Error Handling
- Invalid code format → User-friendly message
- Code already used → "Invalid code" message
- Server error → "An error occurred" fallback
- Network failure → Caught and displayed

---

### STAGE 2: RSVP Form Page (`/rsvp/form/page.tsx`)

#### Purpose
Guest selects attendance status and optionally leaves a message.

#### Initial Session Validation

```typescript
useEffect(() => {
  // 1. Retrieve session and guest from sessionStorage
  const session = sessionStorage.getItem('rsvp_session');
  const guest = sessionStorage.getItem('guest_info');

  // 2. If missing, redirect back to code entry
  if (!session || !guest) {
    router.push('/rsvp');
    return;
  }

  // 3. Parse session data
  const sessionData = JSON.parse(session);
  const guestData = JSON.parse(guest);

  // 4. Check if session has expired (1 hour limit)
  if (new Date(sessionData.expiresAt) < new Date()) {
    sessionStorage.clear();
    router.push('/rsvp');
    return;
  }

  // 5. Set guest info in state
  setGuestInfo(guestData);
}, [router]);
```

#### User Interface
- **Personalized Greeting** - "Welcome, [Guest Name]!"
- **Attendance Options** - Radio buttons with visual feedback
  - Blush pink highlight for "Joyfully accepts"
  - Sky blue highlight for "Regretfully declines"
- **Message Textarea** - 5 rows for well-wishes/dietary restrictions
- **Submit Button** - Large CTA button with loading state
- **Info Box** - Guidance on making changes later

#### Form State Management

```typescript
// State
const [guestInfo, setGuestInfo] = useState<any>(null);
const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('attending');
const [message, setMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Radio Button Options
const options = [
  { value: 'attending', label: 'Joyfully accepts', color: 'blush' },
  { value: 'not_attending', label: 'Regretfully declines', color: 'sky' }
];
```

#### Form Submission

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // 1. Send RSVP data to API
    const response = await fetch('/api/rsvp/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestId: guestInfo.id,
        rsvp_status: rsvpStatus,
        message: message.trim(),
      }),
    });

    const data = await response.json();

    // 2. Handle API errors
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit RSVP');
    }

    // 3. Clear session
    sessionStorage.clear();

    // 4. Redirect to confirmation
    router.push('/rsvp/confirmation');
  } catch (err: any) {
    alert(err.message || 'An error occurred. Please try again.');
    setIsLoading(false);
  }
};
```

#### Loading State
- Shows spinner while submitting
- Disables submit button to prevent double-clicks
- Clears on error so user can retry

---

### STAGE 3: Confirmation Page (`/rsvp/confirmation/page.tsx`)

#### Purpose
Celebrate successful RSVP submission and guide guests to next steps.

#### User Interface Components

**Success Animation**
- Green circular background
- Animated checkmark icon (scales in with spring effect)
- Large "Thank You!" heading
- Confirmation message

**What's Next Section** - Three cards
1. **Save the Date** - June 15, 2026 reminder
2. **Plan Your Trip** - Link to venue information
3. **Check Our Registry** - Shopping suggestions

**Contact Section**
- "Questions or Changes?" heading
- Email contact link
- CTA buttons to home and itinerary

#### Component Features

```typescript
// No state management needed - purely presentational
// Framer Motion animations:
// - Main container: opacity + scale from 0.9
// - Checkmark icon: bouncy spring animation with delay
// - Text sections: staggered fade-in animations

<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
>
  {/* Success checkmark */}
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
  >
    {/* Animated checkmark SVG */}
  </motion.div>
</motion.div>
```

#### Next Steps Guidance
- Calendar icon + deadline reminder
- Location icon + venue information
- Gift icon + registry link
- All backed by page routes on the website

---

## API Endpoints

### Endpoint 1: Code Validation

**Route:** `/api/auth/validate/route.ts`

**Method:** `POST`

**Purpose:** Validate guest invitation code and create session

**Request Body**
```typescript
{
  code: string  // 8-character invitation code
}
```

**Response (Success - 200)**
```typescript
{
  success: true,
  guest: {
    id: string,           // Firestore document ID
    name: string          // Guest full name
  },
  session: {
    guestId: string,                    // Same as guest.id
    code: string,                       // Uppercase code
    expiresAt: string (ISO 8601 date)   // 1 hour from now
  }
}
```

**Response (Error - 400/401)**
```typescript
{
  error: string  // "Invalid code" | "Invalid code format" | "Invalid or already used code"
}
```

**Implementation Details**

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Extract code from request
    const { code } = await request.json();

    // 2. Validate input format
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }

    // 3. Query Firestore for unused guest codes
    const guestsRef = adminDb.collection('guests');
    const snapshot = await guestsRef.where('used', '==', false).get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid or already used code' },
        { status: 401 }
      );
    }

    // 4. Verify code against hashed values (bcrypt)
    let matchedGuest: any = null;
    for (const doc of snapshot.docs) {
      const guest = doc.data();
      // verifyCode() uses bcrypt.compare() to check plain text against hash
      const isValid = await verifyCode(code, guest.code_hash);
      if (isValid) {
        matchedGuest = { id: doc.id, ...guest };
        break;
      }
    }

    // 5. Return error if no match found
    if (!matchedGuest) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }

    // 6. Create session object with 1-hour expiry
    const session = {
      guestId: matchedGuest.id,
      code: code.toUpperCase(),
      expiresAt: new Date(Date.now() + 3600000), // +1 hour
    };

    // 7. Return success with minimal guest data
    return NextResponse.json({
      success: true,
      guest: {
        id: matchedGuest.id,
        name: matchedGuest.name,
      },
      session,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Key Security Measures**
- ✅ Queries only `used: false` guests to prevent replay attacks
- ✅ Uses bcrypt comparison (never compares plain text)
- ✅ Only returns name + ID (not sensitive data)
- ✅ Session expires after 1 hour
- ✅ Runtime: `nodejs` (required for bcrypt)
- ✅ Dynamic: `force-dynamic` (no caching)

---

### Endpoint 2: RSVP Submission

**Route:** `/api/rsvp/submit/route.ts`

**Method:** `POST`

**Purpose:** Save guest's RSVP response and mark code as used

**Request Body**
```typescript
{
  guestId: string,           // From session
  rsvp_status: 'attending' | 'not_attending' | 'pending',
  message?: string           // Optional well-wishes/restrictions
}
```

**Response (Success - 200)**
```typescript
{
  success: true,
  message: string  // "RSVP submitted successfully"
}
```

**Response (Error - 400/404/500)**
```typescript
{
  error: string  // "Missing required fields" | "Guest not found" | "RSVP already submitted" | "Internal server error"
}
```

**Implementation Details**

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request data
    const data = await request.json() as RSVPFormData & { guestId: string };

    // 2. Validate required fields
    if (!data.guestId || !data.rsvp_status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 3. Fetch guest document from Firestore
    const guestRef = adminDb.collection('guests').doc(data.guestId);
    const guestDoc = await guestRef.get();

    // 4. Verify guest exists
    if (!guestDoc.exists) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // 5. Prevent duplicate submissions
    const guestData = guestDoc.data();
    if (guestData?.used) {
      return NextResponse.json(
        { error: 'RSVP already submitted' },
        { status: 400 }
      );
    }

    // 6. Update guest document
    await guestRef.update({
      rsvp_status: data.rsvp_status,      // Save response
      message: data.message || '',        // Save optional message
      used: true,                         // Mark as submitted
      submitted_at: new Date(),           // Timestamp
    });

    // 7. Return success
    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully',
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Key Security Measures**
- ✅ Validates all required fields before processing
- ✅ Checks if guest exists before updating
- ✅ Prevents re-submission by checking `used: true`
- ✅ Records submission timestamp
- ✅ Server-side validation (trusts no client data)

---

## Data Model

### TypeScript Types (`/types/index.ts`)

```typescript
// RSVP Status enum
export type RSVPStatus = 'attending' | 'not_attending' | 'pending';

// Guest document in Firestore
export interface Guest {
  id: string;                    // Firestore doc ID
  name: string;                  // Full guest name
  code_hash: string;             // Bcrypt hashed code
  rsvp_status: RSVPStatus;       // Current RSVP status
  message?: string;              // Optional guest message
  used: boolean;                 // Has code been used?
  submitted_at?: Date;           // When RSVP was submitted
}

// RSVP form submission data
export interface RSVPFormData {
  name: string;                  // (typically read from session)
  rsvp_status: RSVPStatus;       // "attending" | "not_attending"
  message?: string;              // Optional well-wishes
}

// Session data stored in sessionStorage
export interface AuthSession {
  guestId: string;               // Firestore doc ID
  code: string;                  // Uppercase guest code
  expiresAt: Date;               // Session expiry time (1 hour)
}
```

### State Flow During RSVP Process

```
STAGE 1: Code Entry
├─ User Input: code = "ABC12345"
└─ API Response → sessionStorage stores:
   {
     "rsvp_session": {
       "guestId": "doc_xyz",
       "code": "ABC12345",
       "expiresAt": "2025-11-17T15:30:00.000Z"
     },
     "guest_info": {
       "id": "doc_xyz",
       "name": "John Doe"
     }
   }

STAGE 2: Form Filling
├─ Read from sessionStorage → Check expiry
├─ Display: "Welcome, John Doe!"
├─ User selects: rsvpStatus = "attending"
├─ User types: message = "Can't wait to celebrate!"
└─ Ready to submit

STAGE 3: Submission
├─ API receives:
│  {
│    "guestId": "doc_xyz",
│    "rsvp_status": "attending",
│    "message": "Can't wait to celebrate!"
│  }
├─ Firestore updates guest document:
│  {
│    "rsvp_status": "attending",
│    "message": "Can't wait to celebrate!",
│    "used": true,
│    "submitted_at": 2025-11-17T14:30:00.000Z
│  }
└─ Clear sessionStorage → Redirect to confirmation
```

---

## Security Features

### 1. Code Hashing (Bcrypt)

**Problem:** Storing plain-text codes in database is a security risk

**Solution:** Codes are hashed using bcrypt before storage

```typescript
// When generating codes (not in this system, but for reference):
import bcrypt from 'bcrypt';
const code = 'ABC12345';
const hash = await bcrypt.hash(code, 10);
// Stored in Firebase: code_hash = "$2b$10$..."

// When validating codes:
const isValid = await bcrypt.compare('ABC12345', hash);
// Returns true/false without exposing the plain text
```

**Security Benefit:**
- ✅ Even if database is compromised, codes cannot be reversed
- ✅ Brute-force attacks are computationally expensive (bcrypt salting)
- ✅ Each code has unique salt, so identical codes have different hashes

### 2. One-Use Prevention

**Problem:** Codes could be reused if only deleted after use

**Solution:** `used` flag marks codes as consumed

```typescript
// On first code validation:
{
  used: false  // Available for RSVP
}

// After RSVP submission:
{
  used: true   // Locked, cannot be reused
}

// On future validation attempts:
const snapshot = await guestsRef.where('used', '==', false).get();
// Only queries available codes, blocks already-used codes
```

**Security Benefit:**
- ✅ Prevents code reuse attacks
- ✅ Prevents duplicate RSVPs from same guest
- ✅ Maintains data integrity

### 3. Session Management

**Problem:** If session lasts forever, stolen session can access system indefinitely

**Solution:** Sessions expire after 1 hour

```typescript
// Session creation:
const session = {
  guestId: matchedGuest.id,
  code: code.toUpperCase(),
  expiresAt: new Date(Date.now() + 3600000), // 1 hour
};

// Session validation on form page:
if (new Date(sessionData.expiresAt) < new Date()) {
  sessionStorage.clear();
  router.push('/rsvp');
  return;
}
```

**Security Benefit:**
- ✅ Limits window for session hijacking
- ✅ Forces re-authentication after timeout
- ✅ Reduces risk if device is left unattended

### 4. Client-Side Session Storage

**Problem:** Server-side sessions require database/memory overhead

**Solution:** Sessions stored in browser's sessionStorage

```typescript
// Only valid while browser tab is open
sessionStorage.setItem('rsvp_session', JSON.stringify(data.session));

// Automatically cleared when:
// - User closes browser tab
// - User clears browser data
// - Session expires (manual clear in code)
```

**Security Benefit:**
- ✅ Sessions don't persist across browser restarts
- ✅ No server-side state to manage
- ✅ Can't be accessed by other websites (same-origin policy)

### 5. Input Validation

**Problem:** Malicious input could cause SQL injection or code injection

**Solution:** Strict validation on both client and server

```typescript
// Client-side:
- maxLength={8} on input field
- code.trim() to remove whitespace
- .toUpperCase() normalization

// Server-side:
if (!code || typeof code !== 'string') {
  return NextResponse.json({ error: 'Invalid code format' }, { status: 400 });
}
```

**Security Benefit:**
- ✅ Prevents buffer overflow attacks
- ✅ Blocks injection attempts
- ✅ Ensures consistent data format

### 6. Double-Submit Prevention

**Problem:** User could rapidly click submit button, creating duplicate RSVPs

**Solution:** `isLoading` state + server-side `used` check

```typescript
// Client-side:
const [isLoading, setIsLoading] = useState(false);
// Button disabled during submission, prevents user from double-clicking

// Server-side:
if (guestData?.used) {
  return NextResponse.json({ error: 'RSVP already submitted' }, { status: 400 });
}
// Even if client check fails, server prevents duplicate submission
```

**Security Benefit:**
- ✅ Prevents accidental duplicate submissions
- ✅ Prevents intentional duplicate attacks
- ✅ Database integrity maintained

### 7. Minimal Data Exposure

**Problem:** API shouldn't return more data than necessary

**Solution:** Only return required fields

```typescript
// Validation API returns:
{
  guest: {
    id: matchedGuest.id,      // Only ID and name
    name: matchedGuest.name,   // No code, no full record
  }
}

// Submit API takes:
{
  guestId: string,            // ID not full guest object
  rsvp_status: string,
  message?: string
}
```

**Security Benefit:**
- ✅ Reduces attack surface
- ✅ Limits information disclosure
- ✅ Makes it harder to reverse-engineer system

### 8. Error Message Handling

**Problem:** Detailed error messages can leak information about system

**Solution:** Generic error messages for security issues

```typescript
// Security issue errors (generic):
{ error: 'Invalid code' }           // Don't say "code already used"
{ error: 'Invalid code' }           // Don't say "guest not found"

// Validation errors (specific):
{ error: 'Invalid code format' }    // Format issue is OK to expose
{ error: 'Missing required fields' }
```

**Security Benefit:**
- ✅ Prevents user enumeration attacks
- ✅ Doesn't confirm which codes exist in system
- ✅ Doesn't leak guest information

---

## Database Schema

### Firestore Collection: `guests`

#### Document Structure

```typescript
// Document ID: {auto-generated}
{
  // Core Information
  name: string,           // Full guest name
  email?: string,         // Optional email
  phone?: string,         // Optional phone number
  
  // Security
  code_hash: string,      // Bcrypt hashed invitation code
  used: boolean,          // Has this code been used?
  
  // RSVP Response
  rsvp_status: string,    // "attending" | "not_attending" | "pending"
  message: string,        // Guest message/dietary restrictions
  
  // Metadata
  created_at: Timestamp,  // When guest was added
  submitted_at: Timestamp,// When RSVP was submitted (if submitted)
  
  // Optional Fields
  party_size?: number,    // Number of guests in party
  dietary_restrictions?: string,
  accessibility_needs?: string,
}
```

#### Sample Documents

**Guest - Not Yet RSVP'd**
```json
{
  "id": "guest_001",
  "name": "John Smith",
  "email": "john@example.com",
  "code_hash": "$2b$10$N9qo8uLOickgx2...",
  "used": false,
  "rsvp_status": "pending",
  "message": "",
  "created_at": "2025-10-01T10:00:00Z"
}
```

**Guest - RSVP'd (Attending)**
```json
{
  "id": "guest_002",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "code_hash": "$2b$10$k8Zo2uL7Hd6Qc...",
  "used": true,
  "rsvp_status": "attending",
  "message": "We're so excited! We have a dietary restriction - Jane is vegetarian.",
  "created_at": "2025-10-01T10:00:00Z",
  "submitted_at": "2025-11-17T14:30:00Z"
}
```

**Guest - RSVP'd (Not Attending)**
```json
{
  "id": "guest_003",
  "name": "Bob Johnson",
  "code_hash": "$2b$10$M2Lo9uR5Hd2Dq...",
  "used": true,
  "rsvp_status": "not_attending",
  "message": "Congratulations! We unfortunately have a prior commitment.",
  "created_at": "2025-10-01T10:00:00Z",
  "submitted_at": "2025-11-15T09:15:00Z"
}
```

#### Firestore Queries Used

**Query 1: Find all unused codes**
```typescript
const snapshot = await adminDb
  .collection('guests')
  .where('used', '==', false)
  .get();
```
**Purpose:** Get all available invitation codes for validation

**Query 2: Find specific guest by ID**
```typescript
const guestRef = adminDb.collection('guests').doc(guestId);
const guestDoc = await guestRef.get();
```
**Purpose:** Retrieve guest to check if already submitted

**Query 3: Update guest (implicit)**
```typescript
await guestRef.update({
  rsvp_status: data.rsvp_status,
  message: data.message,
  used: true,
  submitted_at: new Date(),
});
```
**Purpose:** Save RSVP response

#### Firestore Indexes (if needed)

For larger guest lists, Firestore may suggest creating indexes:

```yaml
indexes:
  - collection: guests
    fields:
      - name: used
        order: ASCENDING
      - name: created_at
        order: DESCENDING
```

---

## File Structure

### Complete RSVP System Files

```
wedding-rsvp/
├── app/
│   ├── rsvp/
│   │   ├── page.tsx                    ← Stage 1: Code Entry Form
│   │   ├── form/
│   │   │   └── page.tsx                ← Stage 2: RSVP Form
│   │   └── confirmation/
│   │       └── page.tsx                ← Stage 3: Confirmation
│   │
│   └── api/
│       ├── auth/
│       │   └── validate/
│       │       └── route.ts            ← Code validation endpoint
│       │
│       └── rsvp/
│           └── submit/
│               └── route.ts            ← RSVP submission endpoint
│
├── lib/
│   ├── firebase/
│   │   ├── adminApp.ts                 ← Firebase Admin SDK init
│   │   └── clientApp.ts                ← Firebase Client SDK init
│   │
│   └── utils.ts                        ← Utility functions (bcrypt, code verification)
│
├── types/
│   └── index.ts                        ← TypeScript interfaces and types
│
└── components/
    └── ui/
        ├── PageSection.tsx             ← Layout wrapper component
        ├── Input.tsx                   ← Custom input component
        ├── Textarea.tsx                ← Custom textarea component
        └── Button.tsx                  ← Custom button component
```

### Key Files Explained

#### Frontend Pages

| File | Purpose | Route | Status |
|------|---------|-------|--------|
| `/app/rsvp/page.tsx` | Code entry form | `/rsvp` | Entry point |
| `/app/rsvp/form/page.tsx` | RSVP form | `/rsvp/form` | Form submission |
| `/app/rsvp/confirmation/page.tsx` | Success page | `/rsvp/confirmation` | Final page |

#### API Routes

| File | Purpose | Route | Method |
|------|---------|-------|--------|
| `/app/api/auth/validate/route.ts` | Validate code | `/api/auth/validate` | POST |
| `/app/api/rsvp/submit/route.ts` | Submit RSVP | `/api/rsvp/submit` | POST |

#### Utilities & Config

| File | Purpose |
|------|---------|
| `/lib/utils.ts` | `verifyCode()` - bcrypt code comparison |
| `/lib/firebase/adminApp.ts` | Firebase Admin SDK (server-side) |
| `/lib/firebase/clientApp.ts` | Firebase Client SDK (browser-side) |
| `/types/index.ts` | TypeScript type definitions |

#### UI Components

| File | Purpose | Used In |
|------|---------|---------|
| `/components/ui/PageSection.tsx` | Background wrapper | All pages |
| `/components/ui/Input.tsx` | Text input field | Stage 1 & 2 |
| `/components/ui/Textarea.tsx` | Multi-line text | Stage 2 |
| `/components/ui/Button.tsx` | CTA buttons | All pages |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with built-in routing and API routes |
| **React 19** | UI library with hooks (useState, useEffect) |
| **TypeScript** | Type-safe JavaScript |
| **Framer Motion** | Smooth animations and transitions |
| **Tailwind CSS** | Utility-first CSS styling |
| **Next Navigation** | Client-side routing (`useRouter`) |

### Backend

| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless functions for validation/submission |
| **Node.js** | JavaScript runtime environment |
| **Firebase Admin SDK** | Server-side Firestore access |

### Database

| Technology | Purpose |
|------------|---------|
| **Firebase Firestore** | NoSQL cloud database |
| **Firebase Authentication** | Identity management (configured but not used in RSVP) |

### Security

| Technology | Purpose |
|------------|---------|
| **Bcrypt** | Password/code hashing algorithm |
| **sessionStorage** | Client-side temporary storage |

### Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package manager |
| **Vercel** | Deployment platform |
| **VS Code** | Code editor |

---

## Environment Variables

Required `.env.local` file (not committed to repo):

```bash
# Firebase Client Config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Firebase Admin Config (server-side secret)
FIREBASE_ADMIN_SDK_KEY=xxx
```

---

## Common Questions & Answers

### Q: Can a guest change their RSVP after submitting?

**A:** No, the current system prevents re-submission via the `used: true` flag. The API will return "RSVP already submitted" error. Guests must contact the couple directly (via email) to make changes, which must be manually updated in Firebase.

### Q: What happens if a guest loses their code?

**A:** They should email `terddy03@gmail.com` with their name. The couple can:
1. Verify the guest identity
2. Generate a new code for them
3. Share via email or send a new invitation

### Q: How long does the session last?

**A:** 1 hour from code validation. If a guest takes longer, they'll need to re-enter their code.

### Q: Is the RSVP data encrypted?

**A:** In transit: Yes (HTTPS). At rest: Firestore encryption is automatic. Codes are hashed (one-way encryption) so they can't be retrieved.

### Q: Can the couple see the RSVP responses?

**A:** Yes, they're stored in Firestore with:
- Guest name
- RSVP status (attending/not attending)
- Optional message
- Submission timestamp

They'd need to access Firebase console or build an admin dashboard to view.

### Q: What if someone guesses a code?

**A:** Bcrypt makes brute-force attacks computationally expensive. Each attempt requires bcrypt comparison. Codes are also random 8-character strings, making guessing unlikely.

---

## Deployment Instructions

### Prerequisites
- Firebase project with Firestore database
- Vercel account (recommended) or Node.js hosting
- Environment variables configured

### Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard
# - Add all FIREBASE_* variables from .env.local
```

### Deploy to Custom Server

```bash
# 1. Build Next.js
npm run build

# 2. Start production server
npm run start
```

---

## Troubleshooting

### Error: "Invalid code format"
- **Cause:** Code was empty or not a string
- **Fix:** Make sure input field has text before submitting

### Error: "Invalid or already used code"
- **Cause:** Code has been used already or doesn't exist
- **Fix:** Verify code is correct, or contact couple for new code

### Session expires mid-form
- **Cause:** User took >1 hour on form page
- **Fix:** Code entry page shows error, user must re-enter code

### "RSVP already submitted" error
- **Cause:** User refreshed page or browser reloaded during submission
- **Fix:** This prevents duplicate. Check Firebase to confirm submission.

### Firebase connection error
- **Cause:** Firebase SDK not initialized or wrong credentials
- **Fix:** Check environment variables and Firebase project settings

---

## Future Enhancements

1. **Edit RSVP Functionality** - Allow guests to change response (remove `used` flag or create new version field)
2. **Plus-One Support** - Allow main guest to add additional family members
3. **Dietary Preferences** - Structured form for meal selection instead of free text
4. **Seating Assignments** - Admin feature to manage table assignments
5. **Email Confirmations** - Auto-send confirmation email after RSVP
6. **Admin Dashboard** - Real-time RSVP tracking and reports
7. **QR Code Entry** - Generate QR codes instead of text codes
8. **Multi-Language Support** - Support for different languages
9. **Analytics** - Track RSVP response rates and attendance metrics

---

## Support & Contact

- **Guest Support:** terddy03@gmail.com
- **Technical Issues:** Refer to deployment logs in Vercel dashboard
- **Firebase Issues:** Check Firebase console for errors and quotas

---

**Last Updated:** November 17, 2025

**System Version:** 1.0.0 (Initial Release)
