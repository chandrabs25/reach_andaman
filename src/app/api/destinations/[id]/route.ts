'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
export const runtime = 'edge';
// Get a specific destination by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch destination
    const destination = await db.execute(
      'SELECT * FROM destinations WHERE id = ?',
      [id]
    );
    
    if (!destination || destination.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Destination not found' },
        { status: 404 }
      );
    }
    
    // Fetch activities for this destination
    const activities = await db.execute(
      'SELECT * FROM activities WHERE destination_id = ?',
      [id]
    );
    
    // Fetch nearby accommodations
    const accommodations = await db.execute(
      'SELECT * FROM accommodations WHERE destination_id = ?',
      [id]
    );
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...destination[0],
        activities,
        accommodations
      }
    });
  } catch (error) {
    console.error(`Error fetching destination with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}

// Update a destination (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { name, description, location, image_url, highlights } = await request.json();
    
    // Validation
    if (!name && !description && !location && !image_url && !highlights) {
      return NextResponse.json(
        { success: false, message: 'At least one field is required for update' },
        { status: 400 }
      );
    }
    
    // Check if destination exists
    const existingDestination = await db.execute(
      'SELECT * FROM destinations WHERE id = ?',
      [id]
    );
    
    if (!existingDestination || existingDestination.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Destination not found' },
        { status: 404 }
      );
    }
    
    // Build update query dynamically
    let updateFields = [];
    let updateValues = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    
    if (location) {
      updateFields.push('location = ?');
      updateValues.push(location);
    }
    
    if (image_url) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    
    if (highlights) {
      updateFields.push('highlights = ?');
      updateValues.push(JSON.stringify(highlights));
    }
    
    // Add ID to values array
    updateValues.push(id);
    
    // Execute update
    await db.execute(
      `UPDATE destinations SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination updated successfully' 
    });
  } catch (error) {
    console.error(`Error updating destination with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update destination' },
      { status: 500 }
    );
  }
}

// Delete a destination (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if destination exists
    const existingDestination = await db.execute(
      'SELECT * FROM destinations WHERE id = ?',
      [id]
    );
    
    if (!existingDestination || existingDestination.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Destination not found' },
        { status: 404 }
      );
    }
    
    // Delete destination
    await db.execute(
      'DELETE FROM destinations WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Destination deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting destination with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete destination' },
      { status: 500 }
    );
  }
}
