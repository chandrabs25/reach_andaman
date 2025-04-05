// Path: .\src/app\api\packages\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Define interface for Package DB structure (match schema)
interface PackageDataDb {
  id: number | string;
  name: string;
  description?: string | null;
  duration_days?: number | null;
  duration_nights?: number | null;
  price?: number | null;
  destinations?: string | null; // TEXT
  activities?: string | null; // TEXT
  inclusions?: string | null; // TEXT
  exclusions?: string | null; // TEXT
  itinerary?: string | null; // TEXT
  image_url?: string | null;
  highlights?: string | null; // TEXT
  is_active?: number | boolean; // Assuming 1/0 or TRUE/FALSE
  created_at?: string;
  updated_at?: string;
  // Add other fields from schema if needed
}

// Define interface for POST request body
interface CreatePackageBody {
    name: string;
    description: string;
    duration_days: number;
    duration_nights: number;
    price: number;
    destinations?: any;
    activities?: any;
    inclusions?: any;
    exclusions?: any;
    itinerary?: any;
    image_url?: string;
    highlights?: any;
    is_active?: boolean; // Optional, default to true
}

// Get all packages (with filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const duration = searchParams.get('duration'); // Expecting number of days
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const activity = searchParams.get('activity');

    let query = 'SELECT * FROM packages WHERE is_active = 1';
    let params: (string | number)[] = [];

    if (destination) {
      query += ' AND destinations LIKE ?';
      params.push(`%${destination}%`);
    }
    if (duration) {
       const durationNum = parseInt(duration);
        if (!isNaN(durationNum)) {
             query += ' AND duration_days = ?';
             params.push(durationNum);
        }
    }
    if (minPrice) {
       const minPriceNum = parseFloat(minPrice);
        if (!isNaN(minPriceNum)) {
             query += ' AND price >= ?';
             params.push(minPriceNum);
        }
    }
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
        if (!isNaN(maxPriceNum)) {
             query += ' AND price <= ?';
             params.push(maxPriceNum);
        }
    }
    if (activity) {
      query += ' AND activities LIKE ?';
      params.push(`%${activity}%`);
    }

    // --- FIX: Use D1 prepare/bind/all without generic, then assert type ---
    const packagesResult = await db
        .prepare(query)
        .bind(...params)
        .all(); // Fetch all matching packages (no generic here)

    // Access results, provide fallback, cast to unknown, then assert correct type
    const packagesArray = (packagesResult.results || []) as unknown as PackageDataDb[];
    // --- End of FIX ---


     // Optional: Parse JSON fields - TS should infer 'pkg' as PackageDataDb now
    const parsedPackages = packagesArray.map(pkg => { // No explicit type needed for pkg here
         const safeJsonParse = (jsonString: string | null | undefined): any[] | Record<string, any> | null => {
             if (typeof jsonString !== 'string' || jsonString.trim() === '') return null;
             try { return JSON.parse(jsonString); } catch { return null; }
         };
        return {
             ...pkg,
             destinations: safeJsonParse(pkg.destinations) || [],
             activities: safeJsonParse(pkg.activities) || [],
             inclusions: safeJsonParse(pkg.inclusions) || [],
             exclusions: safeJsonParse(pkg.exclusions) || [],
             itinerary: safeJsonParse(pkg.itinerary) || [],
             highlights: safeJsonParse(pkg.highlights) || []
         };
     });


    return NextResponse.json({
      success: true,
      data: parsedPackages
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

// POST function remains the same as the previous correct version...
export async function POST(request: NextRequest) {
  try {
    const {
      name, description, duration_days, duration_nights, price,
      destinations, activities, inclusions, exclusions, itinerary,
      image_url, highlights, is_active = true
    } = await request.json() as CreatePackageBody;

    if (!name || !description || duration_days === undefined || duration_nights === undefined || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Required fields (name, description, duration_days, duration_nights, price) are missing or invalid' },
        { status: 400 }
      );
    }
     if (typeof duration_days !== 'number' || typeof duration_nights !== 'number' || typeof price !== 'number') {
         return NextResponse.json(
             { success: false, message: 'Duration and price fields must be numbers' },
             { status: 400 }
         );
     }

    const result = await db
      .prepare(`
        INSERT INTO packages (
          name, description, duration_days, duration_nights, price,
          destinations, activities, inclusions, exclusions,
          itinerary, image_url, highlights, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      .bind(
        name, description, duration_days, duration_nights, price,
        JSON.stringify(destinations || null),
        JSON.stringify(activities || null),
        JSON.stringify(inclusions || null),
        JSON.stringify(exclusions || null),
        JSON.stringify(itinerary || null),
        image_url || null,
        JSON.stringify(highlights || null),
        is_active ? 1 : 0
      )
      .run();

    const lastRowId = result.meta?.last_row_id;
     if (lastRowId === undefined || lastRowId === null) {
       console.warn("Could not determine last inserted row ID from D1 meta.");
     }

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      data: { id: lastRowId }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create package' },
      { status: 500 }
    );
  }
}