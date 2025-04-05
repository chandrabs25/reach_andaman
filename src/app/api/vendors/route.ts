// Path: .\src\app\api\vendors\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Interfaces based on schema
interface ServiceProviderDb {
    id: number;
    user_id: number;
    business_name: string;
    type: string;
    license_no?: string | null;
    address?: string | null;
    verified: number | boolean; // D1 might return 0/1
    verification_documents?: string | null;
    bank_details?: string | null; // TEXT, needs parsing
    created_at: string;
    updated_at: string;
    // Add fields that might be joined or calculated, like rating if needed
    rating?: number; // Example if rating is calculated/stored elsewhere
}

interface ServiceDb {
    id: number;
    name: string;
    description?: string | null;
    type: string;
    provider_id: number;
    island_id: number;
    price: string; // TEXT in schema
    availability?: string | null;
    images?: string | null;
    amenities?: string | null;
    cancellation_policy?: string | null;
    created_at: string;
    updated_at: string;
}

// Interface for POST request body
interface CreateVendorBody {
    user_id: number; // Need the user ID to link
    business_name: string;
    type: string;
    license_no?: string;
    address?: string;
    verification_documents?: string; // Assuming base64 or URL
    bank_details?: any; // Allow any structure before stringify
    // Services to add initially? This might be complex in one request
    // services?: Array<{ name: string; description?: string; price: number; image_url?: string }>;
}


// Get all vendors (Service Providers) or filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    // Location filter needs adjustment as `location` isn't directly on service_providers
    // Maybe filter by address LIKE? Or based on services offered on certain islands?
    // For now, we'll skip the location filter based on direct schema fields.
    // const location = searchParams.get('location');
    const minRatingParam = searchParams.get('minRating');

    // Build query based on filters
    // NOTE: Rating isn't directly in service_providers schema. Assuming it might be calculated elsewhere or joined.
    // NOTE: The `verified` field in schema is BOOLEAN/INTEGER, not is_approved.
    let query = 'SELECT * FROM service_providers WHERE verified = 1'; // Filter by verified=1
    let params: (string | number)[] = []; // Specify type

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    // Add rating filter if applicable (requires rating data source)
    if (minRatingParam) {
        const minRating = parseFloat(minRatingParam);
        if (!isNaN(minRating)) {
            // This part assumes a 'rating' column exists or is joined.
            // Adjust the query if rating needs calculation (e.g., average from reviews)
             // query += ' AND rating >= ?'; // Uncomment and adjust if rating exists
             // params.push(minRating);
             console.warn("Rating filter specified, but 'rating' column might not be directly available on service_providers table. Adjust query if needed.");
        }
    }

    // --- FIX: Use D1 prepare/bind/all for fetching providers ---
    const vendorsResult = await db
        .prepare(query)
        .bind(...params)
        .all<ServiceProviderDb>();
    // --- End of FIX ---

    const vendors = vendorsResult.results || [];

    // --- FIX: Use D1 prepare/bind/all inside Promise.all for fetching services ---
    // For each vendor, get their services
    const vendorsWithServices = await Promise.all(
      vendors.map(async (vendor) => {
        const servicesResult = await db
          .prepare('SELECT * FROM services WHERE provider_id = ?') // Use services table
          .bind(vendor.id) // Bind the provider ID
          .all<ServiceDb>(); // Fetch all services for this provider

        return {
          ...vendor,
          services: servicesResult.results || [] // Access results array
        };
      })
    );
    // --- End of FIX ---

    return NextResponse.json({
      success: true,
      data: vendorsWithServices
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

// Register a new vendor (Service Provider)
export async function POST(request: NextRequest) {
  try {
    // --- FIX: Add type assertion ---
    const {
      user_id, business_name, type, license_no, address,
      verification_documents, bank_details
      // Assuming services are not added in this initial request for simplicity
    } = await request.json() as CreateVendorBody;
    // --- End of FIX ---

    // Validation
    if (!user_id || !business_name || !type) {
      return NextResponse.json(
        { success: false, message: 'user_id, business_name, and type are required' },
        { status: 400 }
      );
    }

    // Check if user exists and is not already a vendor (optional but good)
    const existingProvider = await db.prepare("SELECT id FROM service_providers WHERE user_id = ?").bind(user_id).first();
    if (existingProvider) {
        return NextResponse.json(
          { success: false, message: 'This user is already registered as a service provider.' },
          { status: 409 }
        );
    }


    // --- FIX: Use D1 prepare/bind/run for INSERT ---
    // Insert vendor into database
    // Assuming 'verified' defaults to FALSE (0) and documents are needed for verification
    const result = await db
      .prepare(`
        INSERT INTO service_providers (
          user_id, business_name, type, license_no, address,
          verified, verification_documents, bank_details,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      .bind(
        user_id,
        business_name,
        type,
        license_no || null,
        address || null,
        0, // Default verified to 0 (False)
        verification_documents || null,
        JSON.stringify(bank_details || null) // Stringify bank details
      )
      .run();
    // --- End of FIX ---

    const vendorId = result.meta?.last_row_id;
     if (vendorId === undefined || vendorId === null) {
       console.warn("Could not determine last inserted row ID for service_provider.");
       // Handle error appropriately if ID is needed immediately
       return NextResponse.json(
           { success: false, message: 'Failed to register vendor profile.' },
           { status: 500 }
         );
     }

    // If services were part of the request, you would insert them here,
    // linking them to 'vendorId'. This can be complex. Example:
    /*
    if (services && Array.isArray(services) && services.length > 0) {
      const stmt = db.prepare("INSERT INTO services (provider_id, name, description, price, ...) VALUES (?, ?, ?, ?, ...)");
      const batch = services.map(service => stmt.bind(vendorId, service.name, service.description, service.price, ...));
      await db.batch(batch);
    }
    */

    return NextResponse.json({
      success: true,
      message: 'Vendor registration submitted successfully. Pending approval.',
      data: { id: vendorId }
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering vendor:', error);
     // Check for potential unique constraint errors (e.g., duplicate user_id)
     if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
         return NextResponse.json(
           { success: false, message: 'Registration failed: Constraint violation (e.g., user already exists as provider).' },
           { status: 409 } // Conflict
         );
     }
    return NextResponse.json(
      { success: false, message: 'Failed to register vendor' },
      { status: 500 }
    );
  }
}