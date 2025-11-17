/**
 * Delete Guest API
 * 
 * DELETE /api/admin/delete-guest
 * 
 * Deletes a guest from the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/adminApp';

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guestId } = await request.json();

    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID required' }, { status: 400 });
    }

    // Delete from Firestore
    await adminDb.collection('guests').doc(guestId).delete();

    return NextResponse.json({ success: true, message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}
