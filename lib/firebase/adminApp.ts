/**
 * Firebase Admin SDK Configuration
 * 
 * This module initializes the Firebase Admin SDK for server-side operations.
 * Used exclusively in API routes for secure database access with elevated privileges.
 * 
 * SECURITY CRITICAL:
 * - Never import this file in client-side code
 * - Only use in /app/api routes or server components
 * - Admin SDK bypasses all Firestore security rules
 * - Private key must remain secret (stored in .env.local, never committed)
 */

import * as admin from 'firebase-admin';

/**
 * Firebase Admin Configuration
 * Using service account credentials for elevated access
 */
const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    // Private key contains escaped newlines (\n), replace with actual newlines
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
};

/**
 * Initialize Firebase Admin App
 * Singleton pattern: Only initialize once to prevent multiple instances error
 */
if (!admin.apps.length) {
  admin.initializeApp(adminConfig);
}

/**
 * Firestore Admin Database Instance
 * Use this for all server-side database operations
 */
export const adminDb = admin.firestore();

/**
 * Firebase Admin Auth Instance
 * Use this for server-side authentication operations (if needed)
 */
export const adminAuth = admin.auth();

export default admin;
