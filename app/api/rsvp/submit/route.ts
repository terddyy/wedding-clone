/**
 * RSVP Submission API Endpoint
 * 
 * ROUTE: POST /api/rsvp/submit
 * 
 * PURPOSE:
 * Saves guest's RSVP response and marks invitation code as used.
 * 
 * SECURITY MEASURES:
 * 1. Validates all required fields
 * 2. Verifies guest exists in database
 * 3. Prevents duplicate submissions (checks used flag)
 * 4. Sanitizes user input
 * 5. Records submission timestamp
 * 
 * FLOW:
 * 1. Receive RSVP data from client (guestId, status, message)
 * 2. Validate required fields
 * 3. Fetch guest document from Firestore
 * 4. Check if code already used
 * 5. Update guest document with response
 * 6. Mark code as used
 * 7. Return success confirmation
 * 
 * RUNTIME: nodejs (required for Firebase Admin SDK)
 * CACHING: force-dynamic (never cache, data changes)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/adminApp';
import { sanitizeInput } from '@/lib/utils';
import { RSVPFormData, RSVPStatus } from '@/types';

// Force Node.js runtime (required for Firebase Admin)
export const runtime = 'nodejs';

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic';

/**
 * POST /api/rsvp/submit
 * Submit RSVP response and mark code as used
 */
export async function POST(request: NextRequest) {
  try {
    // STEP 1: Parse request body
    const body = await request.json();
    const { guestId, rsvp_status, message } = body;

    // STEP 2: Validate required fields
    if (!guestId || typeof guestId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid guest ID' },
        { status: 400 }
      );
    }

    if (!rsvp_status || typeof rsvp_status !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid RSVP status' },
        { status: 400 }
      );
    }

    // Validate RSVP status is one of the allowed values
    const validStatuses: RSVPStatus[] = ['attending', 'not_attending', 'pending'];
    if (!validStatuses.includes(rsvp_status as RSVPStatus)) {
      return NextResponse.json(
        { error: 'Invalid RSVP status value' },
        { status: 400 }
      );
    }

    // STEP 3: Fetch guest document from Firestore
    const guestRef = adminDb.collection('guests').doc(guestId);
    const guestDoc = await guestRef.get();

    // Verify guest exists
    if (!guestDoc.exists) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // STEP 4: Check if code has already been used
    // This prevents duplicate submissions (double-submit protection)
    const guestData = guestDoc.data();
    
    if (guestData?.used === true) {
      return NextResponse.json(
        { error: 'RSVP already submitted' },
        { status: 400 }
      );
    }

    // STEP 5: Sanitize optional message input
    // Remove potentially dangerous characters (XSS prevention)
    const sanitizedMessage = message ? sanitizeInput(message) : '';

    // STEP 6: Update guest document in Firestore
    await guestRef.update({
      rsvp_status: rsvp_status,           // Save attendance status
      message: sanitizedMessage,          // Save optional message
      used: true,                         // Mark code as used (prevents reuse)
      submitted_at: new Date(),           // Record submission timestamp
    });

    // STEP 7: Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'RSVP submitted successfully',
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('RSVP submission error:', error);
    
    // Return generic error to client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/rsvp/submit
 * Handle preflight CORS requests (if needed for production)
 */
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
