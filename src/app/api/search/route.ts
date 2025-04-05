// Path: .\src\app\api\search\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// --- Define interfaces for expected search result structures ---
interface DestinationSearchResult {
  id: number | string;
  name: string;
  description?: string | null;
  location?: string | null;
  image_url?: string | null;
}

interface PackageSearchResult {
  id: number | string;
  name: string;
  description?: string | null;
  duration_days?: number | null;
  duration_nights?: number | null;
  price?: number | null;
  image_url?: string | null;
}

interface VendorSearchResult {
  id: number | string;
  name: string;
  type?: string | null;
  location?: string | null;
  description?: string | null;
  rating?: number | null;
}

interface ActivitySearchResult {
  id: number | string;
  name: string;
  description?: string | null;
  price?: number | null;
  image_url?: string | null;
  destination_name?: string | null; // From JOIN
}

// Define the structure for the final results object
interface SearchResults {
    destinations: DestinationSearchResult[];
    packages: PackageSearchResult[];
    vendors: VendorSearchResult[];
    activities: ActivitySearchResult[];
}
// --- End Interface Definitions ---


// Search API endpoint
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    const type = request.nextUrl.searchParams.get('type') || 'all';

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Search query (q) is required' },
        { status: 400 }
      );
    }

    const searchTerm = `%${query}%`;

    let results: Partial<SearchResults> = {
        destinations: [],
        packages: [],
        vendors: [],
        activities: []
    };

    // --- FIX: Use correct generic type (single object) for .all<T>() ---
    // Search destinations
    if (type === 'all' || type === 'destinations') {
      const destinationsResult = await db.prepare(
        'SELECT id, name, description, location, image_url FROM destinations WHERE name LIKE ? OR description LIKE ? OR location LIKE ? LIMIT 10'
      )
      .bind(searchTerm, searchTerm, searchTerm)
      .all<DestinationSearchResult>(); // Type of a single row object
      results.destinations = destinationsResult.results || [];
    }

    // Search packages
    if (type === 'all' || type === 'packages') {
      const packagesResult = await db.prepare(
        'SELECT id, name, description, duration_days, duration_nights, price, image_url FROM packages WHERE is_active = 1 AND (name LIKE ? OR description LIKE ? OR destinations LIKE ?) LIMIT 10'
      )
      .bind(searchTerm, searchTerm, searchTerm)
      .all<PackageSearchResult>(); // Type of a single row object
      results.packages = packagesResult.results || [];
    }

    // Search vendors
    if (type === 'all' || type === 'vendors') {
      const vendorsResult = await db.prepare(
        'SELECT id, name, type, location, description, rating FROM vendors WHERE is_approved = 1 AND (name LIKE ? OR description LIKE ? OR type LIKE ? OR location LIKE ?) LIMIT 10'
      )
      .bind(searchTerm, searchTerm, searchTerm, searchTerm)
      .all<VendorSearchResult>(); // Type of a single row object
      results.vendors = vendorsResult.results || [];
    }

    // Search activities
    if (type === 'all' || type === 'activities') {
      const activitiesResult = await db.prepare(
        'SELECT a.id, a.name, a.description, a.price, a.image_url, d.name as destination_name FROM activities a JOIN destinations d ON a.destination_id = d.id WHERE a.name LIKE ? OR a.description LIKE ? LIMIT 10'
      )
      .bind(searchTerm, searchTerm)
      .all<ActivitySearchResult>(); // Type of a single row object
      results.activities = activitiesResult.results || [];
    }
    // --- End of FIX ---

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