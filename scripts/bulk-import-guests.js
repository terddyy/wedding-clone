/**
 * Bulk Guest Import Script for Firebase Firestore
 * 
 * This script imports multiple guests into Firestore with bcrypt-hashed invitation codes.
 * 
 * SETUP:
 * 1. Download your Firebase Admin SDK service account key JSON file
 * 2. Save it as 'serviceAccountKey.json' in the project root (it's .gitignored)
 * 3. Edit the 'guests' array below with your guest list
 * 4. Run: node scripts/bulk-import-guests.js
 * 
 * SECURITY NOTE:
 * - serviceAccountKey.json should NEVER be committed to git
 * - It's already in .gitignore for safety
 */

const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');

// Check if service account key exists
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
let serviceAccount;

try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error('\n❌ ERROR: serviceAccountKey.json not found!\n');
  console.log('To get your service account key:');
  console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click "Generate New Private Key"');
  console.log('3. Save the downloaded JSON file as "serviceAccountKey.json" in the project root\n');
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Guest list to import
 * Edit this array with your actual guest information
 */
const guests = [
  {
    name: 'Test User',
    email: 'test@example.com',
    code: 'TEST1234'
  },
  // Add more guests here:
  // {
  //   name: 'John Smith',
  //   email: 'john@example.com',
  //   code: 'ABC12345'
  // },
  // {
  //   name: 'Jane Doe',
  //   email: 'jane@example.com',
  //   code: 'XYZ67890'
  // },
];

/**
 * Add a guest to Firestore
 */
async function addGuest(name, email, code) {
  try {
    // Generate bcrypt hash of the code
    const codeHash = await bcrypt.hash(code.toUpperCase(), 10);
    
    // Create guest document
    const docRef = await db.collection('guests').add({
      name,
      email,
      code_hash: codeHash,
      used: false,
      rsvp_status: 'pending',
      message: '',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`✅ Added: ${name} (Code: ${code.toUpperCase()}) [ID: ${docRef.id}]`);
  } catch (error) {
    console.error(`❌ Failed to add ${name}:`, error.message);
  }
}

/**
 * Main import function
 */
async function importGuests() {
  console.log('\n🚀 Starting Bulk Guest Import...\n');
  console.log(`Total guests to import: ${guests.length}\n`);
  console.log('━'.repeat(60));

  for (const guest of guests) {
    await addGuest(guest.name, guest.email, guest.code);
  }

  console.log('━'.repeat(60));
  console.log(`\n✅ Import complete! Added ${guests.length} guest(s) to Firestore.\n`);
  
  // Exit the process
  process.exit(0);
}

// Run the import
importGuests().catch(error => {
  console.error('\n❌ Import failed:', error);
  process.exit(1);
});
