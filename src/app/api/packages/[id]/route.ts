

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
export const runtime = 'edge';
// Get a specific package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch package
    const packageData = await db.execute(
      'SELECT * FROM packages WHERE id = ?',
      [id]
    );
    
    if (!packageData || packageData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }
    
    // Parse JSON fields
    const result = {
      ...packageData[0],
      destinations: JSON.parse(packageData[0].destinations || '[]'),
      activities: JSON.parse(packageData[0].activities || '[]'),
      inclusions: JSON.parse(packageData[0].inclusions || '[]'),
      exclusions: JSON.parse(packageData[0].exclusions || '[]'),
      itinerary: JSON.parse(packageData[0].itinerary || '[]'),
      highlights: JSON.parse(packageData[0].highlights || '[]')
    };
    
    // Fetch reviews for this package
    const reviews = await db.execute(
      'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.package_id = ?',
      [id]
    );
    
    // Fetch available dates
    const availableDates = await db.execute(
      'SELECT date, available_slots FROM package_availability WHERE package_id = ? AND available_slots > 0 AND date >= CURRENT_DATE ORDER BY date ASC',
      [id]
    );
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...result,
        reviews,
        availableDates
      }
    });
  } catch (error) {
    console.error(`Error fetching package with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch package' },
      { status: 500 }
    );
  }
}

// Update a package (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { 
      name, 
      description, 
      duration_days, 
      duration_nights,
      price,
      destinations,
      activities,
      inclusions,
      exclusions,
      itinerary,
      image_url,
      highlights
    } = await request.json();
    
    // Check if package exists
    const existingPackage = await db.execute(
      'SELECT * FROM packages WHERE id = ?',
      [id]
    );
    
    if (!existingPackage || existingPackage.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
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
    
    if (duration_days) {
      updateFields.push('duration_days = ?');
      updateValues.push(duration_days);
    }
    
    if (duration_nights) {
      updateFields.push('duration_nights = ?');
      updateValues.push(duration_nights);
    }
    
    if (price) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    
    if (destinations) {
      updateFields.push('destinations = ?');
      updateValues.push(JSON.stringify(destinations));
    }
    
    if (activities) {
      updateFields.push('activities = ?');
      updateValues.push(JSON.stringify(activities));
    }
    
    if (inclusions) {
      updateFields.push('inclusions = ?');
      updateValues.push(JSON.stringify(inclusions));
    }
    
    if (exclusions) {
      updateFields.push('exclusions = ?');
      updateValues.push(JSON.stringify(exclusions));
    }
    
    if (itinerary) {
      updateFields.push('itinerary = ?');
      updateValues.push(JSON.stringify(itinerary));
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
      `UPDATE packages SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Package updated successfully' 
    });
  } catch (error) {
    console.error(`Error updating package with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update package' },
      { status: 500 }
    );
  }
}

// Delete a package (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if package exists
    const existingPackage = await db.execute(
      'SELECT * FROM packages WHERE id = ?',
      [id]
    );
    
    if (!existingPackage || existingPackage.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }
    
    // Check if there are any active bookings for this package
    const activeBookings = await db.execute(
      'SELECT COUNT(*) as count FROM bookings WHERE package_id = ? AND status != "cancelled"',
      [id]
    );
    
    if (activeBookings[0].count > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete package with active bookings' },
        { status: 400 }
      );
    }
    
    // Delete package
    await db.execute(
      'DELETE FROM packages WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Package deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting package with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete package' },
      { status: 500 }
    );
  }
}
