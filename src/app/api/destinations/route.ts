'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
export const runtime = 'edge';
// Get all destinations
export async function GET() {
  try {
    const destinations = await db.execute('SELECT * FROM destinations');
    
    return NextResponse.json({ 
      success: true, 
      data: destinations 
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

// Create a new destination (admin only)
export async function POST(request: NextRequest) {
  try {
    const { name, description, location, image_url, highlights } = await request.json();
    
    // Validation
    if (!name || !description || !location) {
      return NextResponse.json(
        { success: false, message: 'Name, description, and location are required' },
        { status: 400 }
      );
    }
    
    // Insert into database
    const result = await db.execute(
      'INSERT INTO destinations (name, description, location, image_url, highlights) VALUES (?, ?, ?, ?, ?)',
      [name, description, location, image_url, JSON.stringify(highlights)]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination created successfully',
      data: { id: result.meta.last_row_id }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create destination' },
      { status: 500 }
    );
  }
}
