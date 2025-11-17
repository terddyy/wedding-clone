/**
 * Get All Guests API
 * 
 * GET /api/admin/guests
 * 
 * Retrieves all guests and their RSVP status
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/adminApp';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token (basic check - in production use proper JWT verification)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all guests from Firestore
    const guestsSnapshot = await adminDb.collection('guests').get();
    const guests = guestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by name
    guests.sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      guests: guests,
      count: guests.length,
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
  }
}
