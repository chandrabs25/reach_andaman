// Path: .\src\app\api\destinations\[id]\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Define interfaces for expected data structures (adapt based on actual schema)
interface Destination {
  id: number | string;
  name: string;
  description?: string | null;
  location?: string | null;
  image_url?: string | null;
  highlights?: string | null; // Assuming TEXT in DB, parsed later if needed
  // Add other destination fields from your schema
}

interface Activity { // Basic structure if fetching related activities
  id: number | string;
  name: string;
  // ... other activity fields
}

interface Accommodation { // Basic structure if fetching related accommodations
  id: number | string;
  name: string;
  // ... other accommodation fields
}

// Define interface for PUT request body
interface UpdateDestinationBody {
    name?: string;
    description?: string;
    location?: string;
    image_url?: string;
    highlights?: any; // Assuming highlights can be any structure before stringifying
}


// Get a specific destination by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // Assuming ID is passed as string, adjust binding if DB expects number

    // --- FIX: Use D1 prepare/bind/first ---
    // Fetch destination
    const destination = await db
      .prepare('SELECT * FROM destinations WHERE id = ?')
      .bind(id)
      .first<Destination>(); // Use specific type
    // --- End of FIX ---

    if (!destination) { // Check if null/undefined
      return NextResponse.json(
        { success: false, message: 'Destination not found' },
        { status: 404 }
      );
    }

    // --- FIX: Use D1 prepare/bind/all for related data ---
    // Fetch activities for this destination (assuming 'activities' table exists)
    const activities = await db
      .prepare('SELECT * FROM activities WHERE destination_id = ?')
      .bind(id)
      .all<Activity[]>(); // Fetch all matching activities

    // Fetch nearby accommodations (assuming 'accommodations' table exists)
    const accommodations = await db
      .prepare('SELECT * FROM accommodations WHERE destination_id = ?')
      .bind(id)
      .all<Accommodation[]>(); // Fetch all matching accommodations
    // --- End of FIX ---

    // Optionally parse JSON fields if stored as TEXT
    let parsedHighlights = destination.highlights;
    try {
        if (typeof destination.highlights === 'string') {
            parsedHighlights = JSON.parse(destination.highlights);
        }
    } catch (e) {
        console.warn(`Failed to parse highlights JSON for destination ${id}:`, destination.highlights);
        // Keep highlights as original string if parsing fails
    }


    return NextResponse.json({
      success: true,
      data: {
        ...destination, // Spread the fetched destination object
        highlights: parsedHighlights, // Use parsed highlights
        activities: activities.results || [], // Access results from D1Result
        accommodations: accommodations.results || [] // Access results from D1Result
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
    // --- FIX: Add type assertion for request body ---
    const { name, description, location, image_url, highlights } = await request.json() as UpdateDestinationBody;
    // --- End of FIX ---

    // Validation
    if (!name && !description && !location && !image_url && highlights === undefined) { // Check explicitly for undefined
      return NextResponse.json(
        { success: false, message: 'At least one field is required for update' },
        { status: 400 }
      );
    }

    // --- FIX: Use D1 prepare/bind/first to check existence ---
    // Check if destination exists
    const existingDestination = await db
      .prepare('SELECT id FROM destinations WHERE id = ?')
      .bind(id)
      .first<{ id: number | string }>();
    // --- End of FIX ---

    if (!existingDestination) {
      return NextResponse.json(
        { success: false, message: 'Destination not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    let updateFields: string[] = [];
    let updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (location !== undefined) {
      updateFields.push('location = ?');
      updateValues.push(location);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (highlights !== undefined) {
      updateFields.push('highlights = ?');
      updateValues.push(JSON.stringify(highlights)); // Stringify highlights
    }

    if (updateFields.length === 0) {
        // Should not happen due to initial validation, but good safety check
        return NextResponse.json({ success: false, message: 'No valid fields provided for update' }, { status: 400 });
    }

    // Add updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    // No need to add CURRENT_TIMESTAMP to updateValues, D1 handles it

    // Add ID to values array for the WHERE clause
    updateValues.push(id);

    // --- FIX: Use D1 prepare/bind/run for UPDATE ---
    // Execute update
    const result = await db
      .prepare(`UPDATE destinations SET ${updateFields.join(', ')} WHERE id = ?`)
      .bind(...updateValues)
      .run();
     // --- End of FIX ---

     // Optional: Check if any row was actually updated
     if (result.meta?.changes === 0) {
       console.warn(`No changes made for destination ID ${id}. Update data might be same as existing.`);
     }

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

    // --- FIX: Use D1 prepare/bind/first to check existence ---
    // Check if destination exists (optional but good practice)
    const existingDestination = await db
        .prepare('SELECT id FROM destinations WHERE id = ?')
        .bind(id)
        .first<{ id: number | string }>();

     if (!existingDestination) {
       return NextResponse.json(
         { success: false, message: 'Destination not found' },
         { status: 404 }
       );
     }
    // --- End of FIX ---


    // Optional: Add checks here if destinations are linked to other tables (e.g., bookings)
    // before allowing deletion.

    // --- FIX: Use D1 prepare/bind/run for DELETE ---
    // Delete destination
    await db
      .prepare('DELETE FROM destinations WHERE id = ?')
      .bind(id)
      .run();
    // --- End of FIX ---

    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully'
    }, { status: 200 }); // Or 204 No Content
  } catch (error) {
    console.error(`Error deleting destination with ID ${params.id}:`, error);
    // Check for potential foreign key constraint errors if applicable
    return NextResponse.json(
      { success: false, message: 'Failed to delete destination' },
      { status: 500 }
    );
  }
}