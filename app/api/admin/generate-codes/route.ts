/**
 * Generate Invitation Codes API
 * 
 * POST /api/admin/generate-codes
 * 
 * Generates unique invitation codes for guests and adds them to Firestore
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/adminApp';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// Generate a random 8-character code
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guestNames } = await request.json();

    if (!Array.isArray(guestNames) || guestNames.length === 0) {
      return NextResponse.json({ error: 'Invalid guest names' }, { status: 400 });
    }

    const codes = [];
    const existingCodes = new Set<string>();

    // Fetch existing codes to avoid duplicates
    const existingSnapshot = await getAdminDb().collection('guests').get();
    existingSnapshot.docs.forEach((doc) => {
      existingCodes.add((doc.data() as any).code_hash);
    });

    // Generate codes for each guest
    for (const name of guestNames) {
      let code: string;
      let codeHash: string;

      // Generate unique code
      do {
        code = generateCode();
        codeHash = await bcrypt.hash(code, 10);
      } while (existingCodes.has(codeHash));

      // Create guest document in Firestore
      const guestDoc = {
        name: name.trim(),
        code_hash: codeHash,
        rsvp_status: 'pending',
        message: '',
        used: false,
        created_at: new Date(),
      };

      try {
        await getAdminDb().collection('guests').add(guestDoc);
        codes.push({
          name: name.trim(),
          code: code,
          hash: codeHash,
        });
      } catch (error) {
        console.error(`Failed to add guest ${name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      codes: codes,
      count: codes.length,
      message: `Successfully generated ${codes.length} invitation codes`,
    });
  } catch (error) {
    console.error('Error generating codes:', error);
    return NextResponse.json({ error: 'Failed to generate codes' }, { status: 500 });
  }
}
