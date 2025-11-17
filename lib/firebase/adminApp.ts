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

// Lazy initialization function to handle missing environment variables during build
function initializeAdminApp() {
  // Check if Firebase Admin SDK is already initialized
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  // Validate required environment variables
  const requiredEnvVars = [
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase Admin environment variables: ${missingVars.join(
        ', '
      )}. Please ensure these are set in your .env.local file.`
    );
  }

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
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  };

  admin.initializeApp(adminConfig);
  return admin.apps[0]!;
}

/**
 * Getter for Firestore Admin Database Instance
 * Lazy initializes Firebase Admin SDK on first access
 * Use this for all server-side database operations
 */
export function getAdminDb() {
  initializeAdminApp();
  return admin.firestore();
}

/**
 * Getter for Firebase Admin Auth Instance
 * Lazy initializes Firebase Admin SDK on first access
 * Use this for server-side authentication operations (if needed)
 */
export function getAdminAuth() {
  initializeAdminApp();
  return admin.auth();
}

export default admin;
