// Path: .\src\app\api\auth\register\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import bcrypt from 'bcryptjs';

// Define an interface for the expected request body
interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  phone?: string; // phone is optional
}

// Register a new user
export async function POST(request: NextRequest) {
  try {
    // --- FIX: Add type assertion here ---
    const body = await request.json() as RegisterRequestBody;
    const { name, email, password, phone } = body;
    // --- End of FIX ---

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Split name into first_name and last_name (simple split)
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''; // Handle cases with only first name

    // Check if user already exists using D1 syntax
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: number }>(); // Check if any user with that email exists

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 } // Use 409 Conflict status code
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get the role_id for 'user' (assuming it's 2 based on your migration)
    const userRoleId = 2; // Replace with actual ID if different

    // Insert user into database using D1 syntax and correct schema fields
    const result = await db
      .prepare(`
        INSERT INTO users (first_name, last_name, email, password_hash, phone, role_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      .bind(
        firstName,      // Use firstName
        lastName,       // Use lastName
        email,
        hashedPassword, // Use the hashed password
        phone || null,  // Use phone or null if undefined
        userRoleId      // Use the role_id
      )
      .run(); // Use run() for INSERT

    // D1's .run() meta might contain last_row_id, but it's safer to rely on RETURNING if possible.
    // For now, let's assume meta.last_row_id works or is acceptable.
    const lastRowId = result.meta?.last_row_id;

    if (lastRowId === undefined || lastRowId === null) {
       // If ID is critical post-registration, consider using RETURNING id in the INSERT
       // and changing .run() to .first<{ id: number }>()
       console.warn("Could not determine last inserted row ID from D1 meta.");
    }


    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: { id: lastRowId } // Return the ID obtained (might be null/undefined if meta doesn't provide it)
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    // Provide a more generic error message to the client
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred during registration.' },
      { status: 500 }
    );
  }
}