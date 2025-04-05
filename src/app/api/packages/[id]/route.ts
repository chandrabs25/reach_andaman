// Path: .\src\app\api\packages\[id]\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Define interfaces for DB schema and related data
interface PackageDataDb {
  id: number | string;
  name: string;
  description?: string | null;
  duration_days?: number | null;
  duration_nights?: number | null;
  price?: number | null;
  destinations?: string | null; // TEXT in DB, needs parsing
  activities?: string | null; // TEXT in DB, needs parsing
  inclusions?: string | null; // TEXT in DB, needs parsing
  exclusions?: string | null; // TEXT in DB, needs parsing
  itinerary?: string | null; // TEXT in DB, needs parsing
  image_url?: string | null;
  highlights?: string | null; // TEXT in DB, needs parsing
  created_at?: string;
  updated_at?: string;
}

interface ReviewDb {
    id: number | string;
    user_id: number | string;
    package_id: number | string; // Assuming reviews can be linked to packages
    rating: number;
    comment?: string | null;
    created_at?: string;
    user_name?: string; // From JOIN
}

interface AvailabilityDateDb {
    date: string; // Assuming DATE type in DB comes as string
    available_slots: number;
}

// Define interface for PUT request body
interface UpdatePackageBody {
    name?: string;
    description?: string;
    duration_days?: number;
    duration_nights?: number;
    price?: number;
    destinations?: any;
    activities?: any;
    inclusions?: any;
    exclusions?: any;
    itinerary?: any;
    image_url?: string;
    highlights?: any;
}


// Get a specific package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // --- FIX: Use D1 prepare/bind/first ---
    // Fetch package
    const packageData = await db
      .prepare('SELECT * FROM packages WHERE id = ?')
      .bind(id)
      .first<PackageDataDb>(); // Use specific type
    // --- End of FIX ---

    if (!packageData) { // Check if null/undefined
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }

    // Function to safely parse JSON string fields
    const safeJsonParse = (jsonString: string | null | undefined, fieldName: string): any[] | Record<string, any> | null => {
      if (typeof jsonString !== 'string' || jsonString.trim() === '') {
        return null; // Return null or appropriate default (e.g., []) if not a valid string
      }
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.warn(`Failed to parse ${fieldName} JSON for package ${id}:`, jsonString, error);
        return null; // Return null or original string on error, depending on requirements
      }
    };

    // Parse JSON fields
    const result = {
      ...packageData,
      destinations: safeJsonParse(packageData.destinations, 'destinations') || [], // Default to empty array
      activities: safeJsonParse(packageData.activities, 'activities') || [],
      inclusions: safeJsonParse(packageData.inclusions, 'inclusions') || [],
      exclusions: safeJsonParse(packageData.exclusions, 'exclusions') || [],
      itinerary: safeJsonParse(packageData.itinerary, 'itinerary') || [],
      highlights: safeJsonParse(packageData.highlights, 'highlights') || []
    };

    // --- FIX: Use D1 prepare/bind/all for related data ---
    // Fetch reviews for this package (assuming a package_id column exists in reviews)
    const reviewsResult = await db
      .prepare('SELECT r.*, u.first_name || " " || u.last_name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.package_id = ?')
      .bind(id)
      .all<ReviewDb[]>(); // Fetch all matching reviews

    // Fetch available dates (assuming package_availability table exists)
    const availableDatesResult = await db
      .prepare('SELECT date, available_slots FROM package_availability WHERE package_id = ? AND available_slots > 0 AND date >= CURRENT_DATE ORDER BY date ASC')
      .bind(id)
      .all<AvailabilityDateDb[]>();
    // --- End of FIX ---


    return NextResponse.json({
      success: true,
      data: {
        ...result,
        reviews: reviewsResult.results || [], // Access results array
        availableDates: availableDatesResult.results || [] // Access results array
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
    // --- FIX: Add type assertion for request body ---
    const {
      name, description, duration_days, duration_nights, price,
      destinations, activities, inclusions, exclusions, itinerary,
      image_url, highlights
    } = await request.json() as UpdatePackageBody;
    // --- End of FIX ---

    // --- FIX: Use D1 prepare/bind/first to check existence ---
    // Check if package exists
    const existingPackage = await db
      .prepare('SELECT id FROM packages WHERE id = ?')
      .bind(id)
      .first<{ id: number | string }>();
    // --- End of FIX ---

    if (!existingPackage) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    let updateFields: string[] = [];
    let updateValues: any[] = [];

    // Helper function to add field if value is provided
    const addUpdateField = (field: keyof UpdatePackageBody, value: any, stringifyJson = false) => {
        if (value !== undefined) {
            updateFields.push(`${field} = ?`);
            updateValues.push(stringifyJson ? JSON.stringify(value) : value);
        }
    };

    addUpdateField('name', name);
    addUpdateField('description', description);
    addUpdateField('duration_days', duration_days);
    addUpdateField('duration_nights', duration_nights);
    addUpdateField('price', price);
    addUpdateField('destinations', destinations, true); // Stringify
    addUpdateField('activities', activities, true);     // Stringify
    addUpdateField('inclusions', inclusions, true);     // Stringify
    addUpdateField('exclusions', exclusions, true);     // Stringify
    addUpdateField('itinerary', itinerary, true);       // Stringify
    addUpdateField('image_url', image_url);
    addUpdateField('highlights', highlights, true);     // Stringify

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields provided for update' },
        { status: 400 }
      );
    }

     // Add updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    // No need to add CURRENT_TIMESTAMP to updateValues for D1

    // Add ID to values array for the WHERE clause
    updateValues.push(id);

    // --- FIX: Use D1 prepare/bind/run for UPDATE ---
    // Execute update
    await db
      .prepare(`UPDATE packages SET ${updateFields.join(', ')} WHERE id = ?`)
      .bind(...updateValues)
      .run();
    // --- End of FIX ---

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

    // --- FIX: Use D1 prepare/bind/first to check existence ---
    const existingPackage = await db
        .prepare('SELECT id FROM packages WHERE id = ?')
        .bind(id)
        .first<{ id: number | string }>();

    if (!existingPackage) {
      return NextResponse.json(
        { success: false, message: 'Package not found' },
        { status: 404 }
      );
    }
    // --- End of FIX ---


    // --- FIX: Use D1 prepare/bind/first for checking related bookings ---
    // Check if there are any active bookings for this package
    // Assuming 'cancelled' is the status for non-active bookings
    const activeBookingsResult = await db
      .prepare('SELECT COUNT(*) as count FROM bookings WHERE package_id = ? AND status NOT IN (?, ?)') // Add relevant non-active statuses
      .bind(id, 'cancelled', 'completed') // Example statuses
      .first<{ count: number }>();

    const activeBookingsCount = activeBookingsResult?.count ?? 0;
    // --- End of FIX ---

    if (activeBookingsCount > 0) {
      return NextResponse.json(
        { success: false, message: `Cannot delete package with ${activeBookingsCount} active bookings` },
        { status: 400 } // Use 400 Bad Request or 409 Conflict
      );
    }

    // --- FIX: Use D1 prepare/bind/run for DELETE ---
    // Delete package
    await db
      .prepare('DELETE FROM packages WHERE id = ?')
      .bind(id)
      .run();
    // --- End of FIX ---

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