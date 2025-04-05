// Path: .\src\app\api\auth\login\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import bcrypt from 'bcryptjs';

// Define an interface for expected request body for clarity (optional but good practice)
interface LoginRequestBody {
  email: string;
  password: string;
}

// Login with credentials
export async function POST(request: NextRequest) {
  try {
    // --- FIX: Add type assertion here ---
    const { email, password } = await request.json() as LoginRequestBody;
    // --- End of FIX ---

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user using D1 syntax
    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<any>(); // Use <any> or a specific User type if defined

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password - Ensure user.password_hash exists and is the correct field name
    if (!user.password_hash) {
         // Handle cases where user might exist but has no password (e.g., OAuth user)
         return NextResponse.json(
           { success: false, message: 'Invalid credentials (no password set)' },
           { status: 401 }
         );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password hash from response
    // Use the correct field name 'password_hash' from your schema
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}