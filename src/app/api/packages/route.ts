'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Get all packages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const duration = searchParams.get('duration');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const activity = searchParams.get('activity');
    
    // Build query based on filters
    let query = 'SELECT * FROM packages WHERE 1=1';
    let params = [];
    
    if (destination) {
      query += ' AND destinations LIKE ?';
      params.push(`%${destination}%`);
    }
    
    if (duration) {
      query += ' AND duration_days = ?';
      params.push(duration);
    }
    
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    
    if (activity) {
      query += ' AND activities LIKE ?';
      params.push(`%${activity}%`);
    }
    
    const packages = await db.execute(query, params);
    
    return NextResponse.json({ 
      success: true, 
      data: packages 
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

// Create a new package (admin only)
export async function POST(request: NextRequest) {
  try {
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
    
    // Validation
    if (!name || !description || !duration_days || !duration_nights || !price) {
      return NextResponse.json(
        { success: false, message: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Insert into database
    const result = await db.execute(
      `INSERT INTO packages (
        name, description, duration_days, duration_nights, price, 
        destinations, activities, inclusions, exclusions, 
        itinerary, image_url, highlights
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description, duration_days, duration_nights, price,
        JSON.stringify(destinations), JSON.stringify(activities),
        JSON.stringify(inclusions), JSON.stringify(exclusions),
        JSON.stringify(itinerary), image_url, JSON.stringify(highlights)
      ]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Package created successfully',
      data: { id: result.meta.last_row_id }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create package' },
      { status: 500 }
    );
  }
}
