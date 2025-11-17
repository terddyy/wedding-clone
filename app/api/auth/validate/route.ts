/**
 * Code Validation API Endpoint
 * 
 * ROUTE: POST /api/auth/validate
 * 
 * PURPOSE:
 * Validates a guest's invitation code and creates a temporary session.
 * 
 * SECURITY MEASURES:
 * 1. Bcrypt code verification (never compares plain text)
 * 2. Only queries unused codes (used: false)
 * 3. Session expires after 1 hour
 * 4. Minimal data exposure (only returns guest ID and name)
 * 5. Generic error messages (prevents user enumeration)
 * 
 * FLOW:
 * 1. Receive code from client
 * 2. Validate input format
 * 3. Query Firebase for unused guest codes
 * 4. Verify code against bcrypt hashes
 * 5. Create session with 1-hour expiry
 * 6. Return guest info and session
 * 
 * RUNTIME: nodejs (required for bcrypt)
 * CACHING: force-dynamic (never cache, security-critical)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/adminApp';
import { verifyCode, generateSession } from '@/lib/utils';

// Force Node.js runtime (required for bcrypt)
export const runtime = 'nodejs';

// Force dynamic rendering (no caching for security)
export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/validate
 * Validate invitation code and create session
 */
export async function POST(request: NextRequest) {
  try {
    // STEP 1: Extract and validate code from request body
    const body = await request.json();
    const { code } = body;

    // Input validation: Code must be a non-empty string
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }

    // Normalize code: Convert to uppercase and trim whitespace
    const normalizedCode = code.trim().toUpperCase();

    // STEP 2: Query Firestore for all unused guest codes
    // Security: Only query guests with used: false to prevent replay attacks
    const guestsRef = getAdminDb().collection('guests');
    const snapshot = await guestsRef.where('used', '==', false).get();

    // If no unused codes exist, return generic error
    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }

    // STEP 3: Verify code against hashed codes using bcrypt
    // Iterate through all unused guests and compare codes
    let matchedGuest: any = null;
    
    for (const doc of snapshot.docs) {
      const guestData = doc.data();
      
      // Security: Use bcrypt to compare plain text code with hash
      // This prevents timing attacks and keeps codes secure
      const isValid = await verifyCode(normalizedCode, guestData.code_hash);
      
      if (isValid) {
        matchedGuest = {
          id: doc.id,
          ...guestData,
        };
        break; // Stop searching once match is found
      }
    }

    // STEP 4: Return error if no match found
    // Security: Generic error message doesn't reveal if code exists
    if (!matchedGuest) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 401 }
      );
    }

    // STEP 5: Generate session with 1-hour expiry
    const session = generateSession(matchedGuest.id, normalizedCode);

    // STEP 6: Return success response with minimal guest data
    // Security: Only return necessary information (ID and name)
    // Don't expose: email, code_hash, or other sensitive data
    return NextResponse.json(
      {
        success: true,
        guest: {
          id: matchedGuest.id,
          name: matchedGuest.name,
        },
        session,
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Validation error:', error);
    
    // Return generic error to client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/validate
 * Handle preflight CORS requests (if needed for production)
 */
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
