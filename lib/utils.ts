/**
 * Utility Functions for Wedding RSVP System
 * 
 * This module contains reusable utility functions used across the application.
 * Following the DRY principle and encapsulating common operations.
 */

import bcrypt from 'bcrypt';

/**
 * Verify Invitation Code Against Hash
 * 
 * This function uses bcrypt to securely compare a plain-text invitation code
 * against a hashed code stored in the database.
 * 
 * SECURITY:
 * - Never compares plain text codes directly
 * - Uses bcrypt's timing-safe comparison to prevent timing attacks
 * - Bcrypt automatically handles salt verification
 * 
 * @param plainCode - The plain text code entered by the user (e.g., "ABC12345")
 * @param hashedCode - The bcrypt hash from database (e.g., "$2b$10$...")
 * @returns Promise<boolean> - True if code matches, false otherwise
 * 
 * @example
 * const isValid = await verifyCode('ABC12345', '$2b$10$N9qo8uLOickgx2...');
 * if (isValid) {
 *   // Code is correct, proceed with authentication
 * }
 */
export async function verifyCode(
  plainCode: string,
  hashedCode: string
): Promise<boolean> {
  try {
    // bcrypt.compare() performs constant-time comparison
    // Returns true if plainCode matches the hash, false otherwise
    const isMatch = await bcrypt.compare(plainCode, hashedCode);
    return isMatch;
  } catch (error) {
    // If bcrypt comparison fails (e.g., invalid hash format), return false
    console.error('Code verification error:', error);
    return false;
  }
}

/**
 * Hash Invitation Code
 * 
 * This function generates a bcrypt hash for an invitation code.
 * Used when creating new guest records (not part of RSVP flow, but included for completeness).
 * 
 * SECURITY:
 * - Uses bcrypt with 10 salt rounds (industry standard)
 * - Each code gets unique salt, so identical codes have different hashes
 * - Hashing is intentionally slow to prevent brute-force attacks
 * 
 * @param plainCode - The plain text code to hash (e.g., "ABC12345")
 * @returns Promise<string> - The bcrypt hash (e.g., "$2b$10$...")
 * 
 * @example
 * const hash = await hashCode('ABC12345');
 * // Store hash in database, never store plain text
 * await adminDb.collection('guests').add({
 *   name: 'John Doe',
 *   code_hash: hash,
 *   used: false,
 * });
 */
export async function hashCode(plainCode: string): Promise<string> {
  try {
    // 10 salt rounds is the recommended minimum for production
    // Higher rounds = more secure but slower (10 is good balance)
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainCode, saltRounds);
    return hash;
  } catch (error) {
    console.error('Code hashing error:', error);
    throw new Error('Failed to hash code');
  }
}

/**
 * Validate Session Expiry
 * 
 * Checks if a session has expired based on its expiresAt timestamp.
 * Sessions expire 1 hour after creation for security.
 * 
 * @param expiresAt - ISO 8601 date string of expiry time
 * @returns boolean - True if session is still valid, false if expired
 * 
 * @example
 * const session = JSON.parse(sessionStorage.getItem('rsvp_session'));
 * if (!isSessionValid(session.expiresAt)) {
 *   // Session expired, redirect to code entry
 *   router.push('/rsvp');
 * }
 */
export function isSessionValid(expiresAt: string): boolean {
  try {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    return expiryDate > now;
  } catch (error) {
    // If date parsing fails, consider session invalid
    return false;
  }
}

/**
 * Generate Session Object
 * 
 * Creates a new session object with 1-hour expiry.
 * Used after successful code validation.
 * 
 * @param guestId - Firestore document ID of the guest
 * @param code - The validated invitation code (uppercase)
 * @returns AuthSession object
 * 
 * @example
 * const session = generateSession(matchedGuest.id, 'ABC12345');
 * // Session will expire 1 hour from now
 */
export function generateSession(guestId: string, code: string) {
  const expiresAt = new Date(Date.now() + 3600000); // +1 hour in milliseconds
  return {
    guestId,
    code: code.toUpperCase(),
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Sanitize User Input
 * 
 * Removes potentially dangerous characters from user input.
 * Basic XSS prevention for text fields.
 * 
 * @param input - Raw user input
 * @returns Sanitized string
 * 
 * @example
 * const message = sanitizeInput(formData.message);
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .substring(0, 1000); // Limit length to prevent buffer overflow
}
