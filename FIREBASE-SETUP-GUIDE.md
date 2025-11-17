# Firebase Firestore Setup - Visual Guide

## Quick Setup for Testing

### Copy-Paste Ready Test Guest Document

Use this JSON to quickly add a test guest in Firebase Console:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "code_hash": "$2b$10$kVv8FJ.OqHHdjo4bzU9eQ.w7jVcq0h5e8ptd6GcBfmecA/dI5Q2i.",
  "used": false,
  "rsvp_status": "pending",
  "message": "",
  "created_at": "2025-11-17T12:00:00.000Z"
}
```

**Test Code:** `TEST1234`

---

## Step-by-Step Firebase Console Instructions

### Step 1: Navigate to Firestore

1. Open: https://console.firebase.google.com
2. Select project: **wedding-rsvp-32d66**
3. Click "Firestore Database" in left sidebar
4. If prompted, click "Create database"
   - Select location: (choose closest to your users)
   - Start in production mode (we'll set rules later)

### Step 2: Create `guests` Collection

1. Click "**Start collection**" button
2. Collection ID: `guests`
3. Click "**Next**"

### Step 3: Add First Document

Firebase will ask you to add the first document. Follow these exact steps:

#### Document ID
- Click "**Auto-ID**" (or enter custom ID like `test-user-001`)

#### Add Fields

Click "**Add field**" for each of these:

| # | Field | Type | Value |
|---|-------|------|-------|
| 1 | `name` | **string** | `Test User` |
| 2 | `email` | **string** | `test@example.com` |
| 3 | `code_hash` | **string** | `$2b$10$kVv8FJ.OqHHdjo4bzU9eQ.w7jVcq0h5e8ptd6GcBfmecA/dI5Q2i.` |
| 4 | `used` | **boolean** | `false` |
| 5 | `rsvp_status` | **string** | `pending` |
| 6 | `message` | **string** | (leave empty) |
| 7 | `created_at` | **timestamp** | Click "**</> CODE**" and enter: `new Date()` |

#### Important Notes

- **For `code_hash`**: Copy the ENTIRE hash string including `$2b$10$...`
- **For `used`**: Must be boolean `false`, NOT string "false"
- **For `created_at`**: Click the "</> CODE" button and type `new Date()`

### Step 4: Save Document

1. Click "**Save**" button
2. You should see your new document in the `guests` collection

---

## Verifying the Setup

### Check in Firebase Console

Your Firestore should look like this:

```
📁 guests (collection)
  📄 [auto-generated-id]
     name: "Test User"
     email: "test@example.com"
     code_hash: "$2b$10$kVv8FJ.OqHHdjo4bzU9eQ..."
     used: false
     rsvp_status: "pending"
     message: ""
     created_at: November 17, 2025 at 12:00:00 PM UTC
```

### Test in Application

1. Open: http://localhost:3000/rsvp
2. Enter code: `TEST1234`
3. Should successfully authenticate ✅

---

## Adding More Guests

### Option 1: Manual Entry (1-10 guests)

Repeat Step 3 for each guest, but:
- Use their real name
- Use their real email
- Generate a unique code hash (see below)
- Each guest needs a unique code

### Option 2: Bulk Import (10+ guests)

Use the bulk import script:

1. Create `serviceAccountKey.json` (see instructions below)
2. Edit `scripts/bulk-import-guests.js`
3. Run: `node scripts/bulk-import-guests.js`

---

## Generating Code Hashes

### For a Single Code

```powershell
node scripts/generate-code-hash.js GUESTCODE1
```

**Output:**
```
Code: GUESTCODE1
Hash: $2b$10$abc123...xyz789
```

Copy the hash and use it as `code_hash` in Firestore.

### For Multiple Codes

```powershell
node scripts/generate-code-hash.js CODE1 CODE2 CODE3 CODE4
```

Generates hashes for all codes at once.

### Code Format Recommendations

- **Length**: 8 characters (enforced in UI)
- **Format**: Mix of letters and numbers
- **Style**: UPPERCASE (automatically converted)
- **Uniqueness**: Each guest needs unique code

**Good examples:**
- `SMITH001`
- `JONES002`
- `DAVIS003`
- `ABC12345`

**Avoid:**
- Short codes: `TEST` (too easy to guess)
- Sequential: `00000001` (not memorable)
- Similar codes: `SMITH001` and `SMITH002` (confusing)

---

## Getting Firebase Service Account Key

For bulk import script, you need the service account key:

### Step-by-Step

1. Go to: https://console.firebase.google.com/project/wedding-rsvp-32d66/settings/serviceaccounts/adminsdk
2. Click "**Generate new private key**" button
3. Confirm by clicking "**Generate key**"
4. A JSON file will download (e.g., `wedding-rsvp-32d66-firebase-adminsdk-xxxxx.json`)
5. Rename it to: `serviceAccountKey.json`
6. Move it to your project root: `c:\Users\User\Downloads\wedding-clone\serviceAccountKey.json`

### ⚠️ CRITICAL SECURITY WARNING

**NEVER commit `serviceAccountKey.json` to git!**

- ✅ It's already in `.gitignore`
- ❌ Don't share this file
- ❌ Don't upload to public repositories
- ❌ Don't email this file

This key gives **full access** to your Firebase project.

---

## Firestore Security Rules

### Current Setup (Development)

Your current Firestore rules allow server-side access only:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // All client access blocked
    // API routes use Admin SDK (bypasses these rules)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Why This Is Secure

- ✅ All client-side access is blocked
- ✅ API routes use Admin SDK (server-side, bypasses rules)
- ✅ No direct database access from browser
- ✅ Prevents unauthorized reads/writes

### To Update Rules

1. Go to: https://console.firebase.google.com/project/wedding-rsvp-32d66/firestore/rules
2. Paste the rules above
3. Click "**Publish**"

---

## Testing Your Setup

### Quick Test Checklist

1. ✅ Firestore has `guests` collection
2. ✅ Test guest document exists with correct fields
3. ✅ `code_hash` is the bcrypt hash (starts with `$2b$10$`)
4. ✅ `used` is boolean `false` (not string)
5. ✅ `rsvp_status` is string `"pending"`
6. ✅ Dev server is running (`npm run dev`)
7. ✅ Can access http://localhost:3000/rsvp
8. ✅ Code `TEST1234` validates successfully

### If Something Goes Wrong

**Problem:** "Invalid code" error

**Check:**
- Is `used` field `false`?
- Does `code_hash` exactly match the generated hash?
- Is code entered as `TEST1234` (uppercase)?

**Problem:** Can't save document in Firestore

**Check:**
- Are you logged into correct Firebase account?
- Do you have Owner/Editor permissions on the project?
- Is Firestore database created?

**Problem:** "Firebase Admin SDK initialization failed"

**Check:**
- Is `.env.local` file present?
- Are all `FIREBASE_ADMIN_*` variables set?
- Does `FIREBASE_ADMIN_PRIVATE_KEY` have escaped newlines (`\n`)?

---

## Quick Reference

### Test Credentials
- **Code:** `TEST1234`
- **Hash:** `$2b$10$kVv8FJ.OqHHdjo4bzU9eQ.w7jVcq0h5e8ptd6GcBfmecA/dI5Q2i.`
- **Guest Name:** Test User
- **Email:** test@example.com

### Important URLs
- **Firebase Console:** https://console.firebase.google.com/project/wedding-rsvp-32d66
- **Firestore Database:** https://console.firebase.google.com/project/wedding-rsvp-32d66/firestore
- **Service Accounts:** https://console.firebase.google.com/project/wedding-rsvp-32d66/settings/serviceaccounts
- **Local Dev Server:** http://localhost:3000

### Key Commands
```powershell
# Start dev server
npm run dev

# Generate code hash
node scripts/generate-code-hash.js YOURCODE

# Bulk import guests
node scripts/bulk-import-guests.js
```

---

**You're all set! 🎉 Proceed to TESTING-GUIDE.md for the complete testing flow.**
