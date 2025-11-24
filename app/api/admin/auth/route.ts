/**
 * Admin Authentication API
 * 
 * POST /api/admin/auth
 * 
 * Authenticates admin user with password
 */

import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 'admin123'; // In production, use hashed password
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    // Securely compare the provided password with the stored hash
    const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate a simple JWT token (use a proper JWT library in production)
    const token = crypto.randomBytes(32).toString('hex');

    return NextResponse.json({
      success: true,
      token: token,
      message: 'Admin authenticated successfully',
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
