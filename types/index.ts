/**
 * TypeScript Type Definitions for Wedding RSVP System
 * 
 * This file contains all type definitions used across the RSVP system.
 * Following strict type safety principles for production-ready code.
 */

/**
 * RSVP Status enum
 * Represents the three possible states of a guest's response
 */
export type RSVPStatus = 'attending' | 'not_attending' | 'pending';

/**
 * Guest Document Interface
 * Represents a guest record in Firebase Firestore
 * 
 * @property id - Firestore document ID
 * @property name - Full name of the guest
 * @property email - Optional email address
 * @property code_hash - Bcrypt hashed invitation code (never store plain text)
 * @property rsvp_status - Current RSVP status
 * @property message - Optional message from guest (well-wishes, dietary restrictions, etc.)
 * @property used - Flag indicating if the invitation code has been used
 * @property submitted_at - Timestamp when RSVP was submitted
 * @property created_at - Timestamp when guest was added to system
 */
export interface Guest {
  id: string;
  name: string;
  email?: string;
  code_hash: string;
  rsvp_status: RSVPStatus;
  message?: string;
  used: boolean;
  submitted_at?: Date;
  created_at?: Date;
}

/**
 * RSVP Form Data Interface
 * Represents the data submitted by the guest on the RSVP form
 * 
 * @property name - Guest name (read-only, from session)
 * @property rsvp_status - Selected attendance status
 * @property message - Optional message from guest
 */
export interface RSVPFormData {
  name: string;
  rsvp_status: RSVPStatus;
  message?: string;
}

/**
 * Authentication Session Interface
 * Represents a temporary session stored in sessionStorage
 * 
 * @property guestId - Firestore document ID of authenticated guest
 * @property code - Uppercase invitation code used for authentication
 * @property expiresAt - ISO 8601 date string when session expires (1 hour from creation)
 */
export interface AuthSession {
  guestId: string;
  code: string;
  expiresAt: string; // ISO 8601 date string
}

/**
 * API Response Types
 */

/**
 * Validation API Success Response
 */
export interface ValidationResponse {
  success: true;
  guest: {
    id: string;
    name: string;
  };
  session: AuthSession;
}

/**
 * Validation API Error Response
 */
export interface ValidationError {
  error: string;
}

/**
 * RSVP Submission API Success Response
 */
export interface SubmissionResponse {
  success: true;
  message: string;
}

/**
 * RSVP Submission API Error Response
 */
export interface SubmissionError {
  error: string;
}
