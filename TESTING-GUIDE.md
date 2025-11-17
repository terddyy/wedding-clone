# 🚀 RSVP System - Testing Guide

## Prerequisites Checklist

✅ All dependencies installed (`npm install` completed)
✅ `.env.local` file configured with Firebase credentials
✅ Next.js dev server running (`npm run dev`)

## Step 1: Add Test Guest to Firestore

You need to manually add a test guest document to your Firebase Firestore database.

### Option A: Using Firebase Console (Recommended for Testing)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/project/wedding-rsvp-32d66/firestore

2. **Create Collection**
   - Click "Start collection"
   - Collection ID: `guests`
   - Click "Next"

3. **Add Test Document**
   - Click "Auto-ID" or enter a custom Document ID
   - Add these fields:

   | Field Name | Type | Value |
   |------------|------|-------|
   | `name` | string | `Test User` |
   | `email` | string | `test@example.com` |
   | `code_hash` | string | `$2b$10$kVv8FJ.OqHHdjo4bzU9eQ.w7jVcq0h5e8ptd6GcBfmecA/dI5Q2i.` |
   | `used` | boolean | `false` |
   | `rsvp_status` | string | `pending` |
   | `message` | string | `` (empty) |
   | `created_at` | timestamp | Click "Current timestamp" |

4. **Save the Document**
   - Click "Save"

### Option B: Using Bulk Import Script (For Multiple Guests)

1. **Download Service Account Key**
   - Go to: Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in project root
   - ⚠️ **NEVER commit this file to git** (already in .gitignore)

2. **Edit Guest List**
   - Open `scripts/bulk-import-guests.js`
   - Modify the `guests` array with your guest information:

   ```javascript
   const guests = [
     {
       name: 'Test User',
       email: 'test@example.com',
       code: 'TEST1234'
     },
     {
       name: 'John Smith',
       email: 'john@example.com',
       code: 'ABC12345'
     },
     // Add more guests...
   ];
   ```

3. **Run Import Script**
   ```powershell
   node scripts/bulk-import-guests.js
   ```

## Step 2: Test the RSVP Flow

### 2.1 Start Development Server

If not already running:

```powershell
npm run dev
```

Server will start at: **http://localhost:3000**

### 2.2 Test Stage 1: Code Entry

1. Open browser to: http://localhost:3000/rsvp
2. Enter invitation code: **TEST1234**
3. Click "Continue to RSVP"

**Expected Result:**
- ✅ Page redirects to `/rsvp/form`
- ✅ Greeting shows: "Welcome, Test User!"

**If you see an error:**
- ❌ "Invalid code" → Check that code_hash in Firestore matches
- ❌ "Invalid code format" → Make sure you entered TEST1234
- ❌ Redirect to /rsvp → Session validation failed, check browser console

### 2.3 Test Stage 2: RSVP Form

1. Select attendance: **"Joyfully accepts"** or **"Regretfully declines"**
2. (Optional) Enter message: "Can't wait to celebrate!"
3. Click "Submit RSVP"

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Page redirects to `/rsvp/confirmation`
- ✅ Success checkmark animation plays

**If you see an error:**
- ❌ Alert popup → Check browser console for error details
- ❌ "RSVP already submitted" → Code has already been used (check Firestore `used` field)

### 2.4 Test Stage 3: Confirmation

1. See success message: "Thank You! Your RSVP has been received"
2. View "What's Next?" guidance cards
3. Test navigation buttons

**Expected Result:**
- ✅ Success animation displays
- ✅ Navigation buttons work
- ✅ Session is cleared from browser

### 2.5 Verify in Firestore

1. Go back to Firebase Console: https://console.firebase.google.com/project/wedding-rsvp-32d66/firestore
2. Open the `guests` collection
3. Find your test user document

**Expected Changes:**
- ✅ `used`: `true` (was `false`)
- ✅ `rsvp_status`: `attending` or `not_attending` (was `pending`)
- ✅ `message`: Your message text (if provided)
- ✅ `submitted_at`: Current timestamp (new field)

## Step 3: Test Security Features

### 3.1 Test Code Reuse Prevention

1. Try to enter **TEST1234** again
2. Should see: **"Invalid code"** error
3. ✅ System prevents code reuse

### 3.2 Test Session Expiry

1. Enter a valid code
2. On the form page, open DevTools → Application → Session Storage
3. Manually edit `rsvp_session` → Change `expiresAt` to a past date
4. Refresh the page
5. ✅ Should redirect back to `/rsvp` (expired session)

### 3.3 Test Invalid Code

1. Try code: **INVALID1**
2. Should see: **"Invalid code"** error
3. ✅ System rejects non-existent codes

## Step 4: Generate Production Codes

Once testing is complete, generate real invitation codes:

### 4.1 Generate Codes

```powershell
node scripts/generate-code-hash.js SMITH001 JONES002 DAVIS003
```

### 4.2 Add to Firestore

Copy the generated hashes and add guest documents with real names and emails.

## Troubleshooting

### Issue: "Cannot find module 'bcrypt'"

**Solution:**
```powershell
npm install bcrypt
```

### Issue: "Firebase Admin SDK initialization failed"

**Solution:**
- Check `.env.local` has correct `FIREBASE_ADMIN_PRIVATE_KEY`
- Make sure key has `\n` escaped (as shown in .env.local)
- Verify `FIREBASE_ADMIN_CLIENT_EMAIL` matches your Firebase project

### Issue: "Session validation failed"

**Solution:**
- Clear browser cache and cookies
- Clear sessionStorage: DevTools → Application → Session Storage → Clear All
- Try in incognito/private browsing mode

### Issue: Port 3000 already in use

**Solution:**
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or run on different port
npm run dev -- -p 3001
```

### Issue: Firestore permission denied

**Solution:**
- API routes use Admin SDK (bypass Firestore rules)
- If seeing errors, check Firebase Console → Firestore → Rules
- Verify Admin SDK credentials are correct

## Next Steps

Once testing is successful:

1. ✅ Generate real invitation codes for all guests
2. ✅ Import all guests to Firestore
3. ✅ Deploy to Vercel (see README-RSVP-SYSTEM.md)
4. ✅ Send invitation codes to guests

## Production Deployment Checklist

Before deploying:

- [ ] All environment variables added to Vercel
- [ ] All real guests imported to Firestore
- [ ] Test codes removed from Firestore
- [ ] Firestore security rules configured
- [ ] Custom domain configured (optional)
- [ ] Firebase billing enabled (if expecting high traffic)
- [ ] Test RSVP flow on production URL

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Next.js terminal output for server errors
3. Check Firebase Console → Firestore for data issues
4. Review API route logs in terminal

For additional help, refer to:
- `README-RSVP-SYSTEM.md` - Full system documentation
- `RSVP.md` - Complete implementation guide

---

**Happy Testing! 🎉**
