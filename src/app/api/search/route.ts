

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
export const runtime = 'edge';
// Search API endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    
    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const searchTerm = `%${query}%`;
    let results = {};
    
    // Search destinations
    if (type === 'all' || type === 'destinations') {
      const destinations = await db.execute(
        'SELECT id, name, description, location, image_url FROM destinations WHERE name LIKE ? OR description LIKE ? OR location LIKE ? LIMIT 10',
        [searchTerm, searchTerm, searchTerm]
      );
      results.destinations = destinations;
    }
    
    // Search packages
    if (type === 'all' || type === 'packages') {
      const packages = await db.execute(
        'SELECT id, name, description, duration_days, duration_nights, price, image_url FROM packages WHERE name LIKE ? OR description LIKE ? OR destinations LIKE ? LIMIT 10',
        [searchTerm, searchTerm, searchTerm]
      );
      results.packages = packages;
    }
    
    // Search vendors
    if (type === 'all' || type === 'vendors') {
      const vendors = await db.execute(
        'SELECT id, name, type, location, description, rating FROM vendors WHERE is_approved = 1 AND (name LIKE ? OR description LIKE ? OR type LIKE ? OR location LIKE ?) LIMIT 10',
        [searchTerm, searchTerm, searchTerm, searchTerm]
      );
      results.vendors = vendors;
    }
    
    // Search activities
    if (type === 'all' || type === 'activities') {
      const activities = await db.execute(
        'SELECT a.id, a.name, a.description, a.price, a.image_url, d.name as destination_name FROM activities a JOIN destinations d ON a.destination_id = d.id WHERE a.name LIKE ? OR a.description LIKE ? LIMIT 10',
        [searchTerm, searchTerm]
      );
      results.activities = activities;
    }
    
    return NextResponse.json({ 
      success: true, 
      data: results
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
