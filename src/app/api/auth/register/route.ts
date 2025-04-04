
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import bcrypt from 'bcryptjs';
export const runtime = 'edge';
// Register a new user
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into database
    const result = await db.execute(
      `INSERT INTO users (
        name, email, password, phone, role, created_at
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, email, hashedPassword, phone || null, 'user']
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully',
      data: { id: result.meta.last_row_id }
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register user' },
      { status: 500 }
    );
  }
}
