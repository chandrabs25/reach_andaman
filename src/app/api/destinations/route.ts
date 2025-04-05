// Path: .\src/app/api/destinations/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Define interface for a Destination object (based on schema/usage)
interface Destination {
  id: number | string;
  name: string;
  description?: string | null;
  location?: string | null;
  image_url?: string | null;
  highlights?: string | null; // Assuming TEXT in DB
  // Add other fields if necessary
  created_at?: string;
  updated_at?: string;
}

// Define interface for POST request body
interface CreateDestinationBody {
    name: string;
    description: string;
    location: string;
    image_url?: string; // Optional
    highlights?: any; // Can be any structure before stringifying
}


// Get all destinations
export async function GET() {
  try {
    // Use D1 prepare/all
    const destinationsResult = await db
        .prepare('SELECT * FROM destinations')
        .all(); // Fetch all destinations

    // --- FIX: Cast to unknown first, then to Destination[] ---
    // Access the results array, provide fallback, cast to unknown, then to Destination[]
    const destinationsArray = (destinationsResult.results || []) as unknown as Destination[];
    // --- End of FIX ---

    // Now map over the correctly typed array
    const parsedDestinations = destinationsArray.map((dest) => {
        let parsedHighlights: any = dest.highlights;
        try {
            if (typeof dest.highlights === 'string' && dest.highlights.trim() !== '') {
                parsedHighlights = JSON.parse(dest.highlights);
            }
        } catch (e) {
            console.warn(`Failed to parse highlights JSON for destination ${dest.id}:`, dest.highlights);
            parsedHighlights = dest.highlights;
        }
        return { ...dest, highlights: parsedHighlights };
    });

    return NextResponse.json({
      success: true,
      data: parsedDestinations // Return the array of results
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

// POST function remains the same as the previous correct version...
export async function POST(request: NextRequest) {
  try {
    const { name, description, location, image_url, highlights } = await request.json() as CreateDestinationBody;

    if (!name || !description || !location) {
      return NextResponse.json(
        { success: false, message: 'Name, description, and location are required' },
        { status: 400 }
      );
    }

    const result = await db
      .prepare(
        'INSERT INTO destinations (name, description, location, image_url, highlights, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
      )
      .bind(
          name,
          description,
          location,
          image_url || null,
          JSON.stringify(highlights || null)
       )
      .run();

    const lastRowId = result.meta?.last_row_id;
     if (lastRowId === undefined || lastRowId === null) {
       console.warn("Could not determine last inserted row ID from D1 meta.");
     }

    return NextResponse.json({
      success: true,
      message: 'Destination created successfully',
      data: { id: lastRowId }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create destination' },
      { status: 500 }
    );
  }
}