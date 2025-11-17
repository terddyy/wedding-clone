# Wedding RSVP System

A secure, production-ready RSVP system built with Next.js 15, TypeScript, Firebase Firestore, and Framer Motion.

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
# Rename package-nextjs.json to package.json
mv package-nextjs.json package.json

# Install dependencies
npm install
```

### 2. Environment Setup

Your `.env.local` file is already configured with all necessary credentials.

### 3. Firebase Setup

#### Create Guest Documents in Firestore

Before testing, you need to add guest records to your Firebase Firestore database:

1. Go to [Firebase Console](https://console.firebase.google.com/project/wedding-rsvp-32d66/firestore)
2. Create a collection called `guests`
3. Add a test document with this structure:

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  code_hash: "$2b$10$N9qo8uLOickgx2ZMzqL7nO7M4qiU3c9v.JqPZq9Zq9Zq9Zq9Zq9Z.", // bcrypt hash of "TEST1234"
  used: false,
  rsvp_status: "pending",
  message: "",
  created_at: new Date()
}
```

**Important:** To generate the `code_hash` for your actual invitation codes, use this script:

```javascript
// Run this in Node.js to hash your codes
const bcrypt = require('bcrypt');

async function hashCode(code) {
  const hash = await bcrypt.hash(code, 10);
  console.log(`Code: ${code}`);
  console.log(`Hash: ${hash}`);
}

hashCode('TEST1234'); // Replace with your actual invitation codes
```

### 4. Run Development Server

```powershell
npm run dev
```

Visit: http://localhost:3000

## 📋 System Architecture

### Three-Stage RSVP Flow

1. **Stage 1: Code Entry** (`/rsvp`)
   - Guest enters unique invitation code
   - Code validated via bcrypt comparison
   - Session created (1-hour expiry)

2. **Stage 2: RSVP Form** (`/rsvp/form`)
   - Session validated
   - Guest selects attendance status
   - Optional message submission

3. **Stage 3: Confirmation** (`/rsvp/confirmation`)
   - Success animation
   - Next steps guidance
   - Navigation to other sections

### API Endpoints

- `POST /api/auth/validate` - Validate invitation code
- `POST /api/rsvp/submit` - Submit RSVP response

### Security Features

✅ **Bcrypt Code Hashing** - Never stores plain text codes
✅ **One-Use Prevention** - Codes marked as used after submission
✅ **Session Management** - 1-hour session expiry
✅ **Input Sanitization** - XSS prevention
✅ **Double-Submit Protection** - Server-side validation

## 🗂️ Project Structure

```
wedding-rsvp/
├── app/
│   ├── api/
│   │   ├── auth/validate/route.ts    # Code validation endpoint
│   │   └── rsvp/submit/route.ts      # RSVP submission endpoint
│   ├── rsvp/
│   │   ├── page.tsx                  # Stage 1: Code entry
│   │   ├── form/page.tsx             # Stage 2: RSVP form
│   │   └── confirmation/page.tsx     # Stage 3: Confirmation
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home (redirects to /rsvp)
│   └── globals.css                   # Global styles
├── components/ui/
│   ├── Button.tsx                    # Button component
│   ├── Input.tsx                     # Input component
│   ├── Textarea.tsx                  # Textarea component
│   └── PageSection.tsx               # Layout wrapper
├── lib/
│   ├── firebase/
│   │   ├── adminApp.ts               # Firebase Admin SDK
│   │   └── clientApp.ts              # Firebase Client SDK
│   └── utils.ts                      # Utility functions
├── types/
│   └── index.ts                      # TypeScript types
└── .env.local                        # Environment variables
```

## 🧪 Testing the System

### Test Credentials

Use this test invitation code: **TEST1234**

(Make sure you've added the corresponding guest document to Firestore with the hashed code)

### Test Flow

1. Visit http://localhost:3000/rsvp
2. Enter code: **TEST1234**
3. Click "Continue to RSVP"
4. Select attendance status
5. (Optional) Write message
6. Click "Submit RSVP"
7. See confirmation page

### Verify in Firestore

After submission, check the guest document in Firestore:
- `used` should be `true`
- `rsvp_status` should be updated
- `message` should contain your text
- `submitted_at` should have a timestamp

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Then add all environment variables from `.env.local` to your Vercel project settings.

### Environment Variables Required

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

## 📧 Guest Management

### Adding New Guests

To add guests to your system, you'll need to:

1. Generate a unique 8-character code (e.g., "ABC12345")
2. Hash the code using bcrypt
3. Add a document to the `guests` collection

**Bulk Import Script:**

```javascript
// bulk-import-guests.js
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const db = admin.firestore();

async function addGuest(name, email, code) {
  const codeHash = await bcrypt.hash(code, 10);
  
  await db.collection('guests').add({
    name,
    email,
    code_hash: codeHash,
    used: false,
    rsvp_status: 'pending',
    message: '',
    created_at: new Date()
  });
  
  console.log(`Added guest: ${name} (Code: ${code})`);
}

// Add your guests
addGuest('John Smith', 'john@example.com', 'ABC12345');
addGuest('Jane Doe', 'jane@example.com', 'XYZ67890');
```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate codes after testing** - Generate new codes for production
3. **Set Firestore security rules** - Restrict database access
4. **Enable Firebase App Check** - Prevent API abuse
5. **Monitor Firebase usage** - Set up billing alerts

### Recommended Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Block all client-side access
    // API routes use Admin SDK (bypasses these rules)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 📊 Monitoring RSVPs

You can view all RSVP responses in the Firebase Console:

1. Go to [Firestore Database](https://console.firebase.google.com/project/wedding-rsvp-32d66/firestore)
2. Select the `guests` collection
3. Filter by:
   - `used: true` - Submitted RSVPs
   - `rsvp_status: "attending"` - Attending guests
   - `rsvp_status: "not_attending"` - Declined guests

### Export RSVPs to CSV

Use this Firebase script to export RSVPs:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const db = admin.firestore();

async function exportRSVPs() {
  const snapshot = await db.collection('guests').where('used', '==', true).get();
  
  const csvHeader = 'Name,Email,Status,Message,Submitted At\n';
  let csvContent = csvHeader;
  
  snapshot.forEach(doc => {
    const data = doc.data();
    csvContent += `"${data.name}","${data.email}","${data.rsvp_status}","${data.message}","${data.submitted_at?.toDate()}"\n`;
  });
  
  fs.writeFileSync('rsvps.csv', csvContent);
  console.log('Exported to rsvps.csv');
}

exportRSVPs();
```

## 🎨 Customization

### Update Wedding Details

Edit these values in `.env.local`:

```
NEXT_PUBLIC_WEDDING_DATE=2025-12-21
NEXT_PUBLIC_COUPLE_NAMES=Jhe & Eifer
```

### Change Colors

Edit `tailwind.config.ts` to customize the blush and sky color palettes.

### Update RSVP Deadline

Edit `app/rsvp/page.tsx` line 219:

```tsx
<span className="font-semibold text-blush-600">November 21, 2025</span>
```

## 📞 Support

For issues or questions:
- Email: terddy03@gmail.com
- Review documentation in `RSVP.md`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Bcrypt + Custom Session Management
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Deployment**: Vercel (recommended)

## 📝 License

MIT License - Feel free to use for your own wedding!

---

**Built with ❤️ for Jhe & Eifer's special day**
