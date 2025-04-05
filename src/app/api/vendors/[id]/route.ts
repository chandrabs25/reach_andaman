// Path: .\src\app\api\vendors\[id]\route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Define interfaces based on schema
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

interface ReviewDb {
    id: number;
    user_id: number;
    service_id: number;
    rating: number;
    comment?: string | null;
    images?: string | null;
    created_at: string;
    updated_at: string;
    user_name?: string; // Added from JOIN
}

// Interface for PUT request body
interface UpdateServiceProviderBody {
    business_name?: string;
    description?: string; // Description is not in service_providers table? Add if needed.
    address?: string;
    contact_email?: string; // Email is in users table, might need separate update
    contact_phone?: string; // Phone is in users table
    website?: string; // Not in schema
    bank_details?: any; // Allow any for input before stringify
    // Add other updatable fields from service_providers schema if needed
}


// Get a specific vendor (Service Provider) by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const providerId = parseInt(params.id); // Convert ID to number if it's numeric
    if (isNaN(providerId)) {
        return NextResponse.json({ success: false, message: 'Invalid Vendor ID' }, { status: 400 });
    }

    // --- FIX: Use D1 prepare/bind/first for vendor ---
    const vendor = await db
      .prepare('SELECT * FROM service_providers WHERE id = ?') // Use service_providers table
      .bind(providerId)
      .first<ServiceProviderDb>();
    // --- End of FIX ---

    if (!vendor) { // Check if null/undefined
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    // --- FIX: Use D1 prepare/bind/all for services ---
    // Fetch vendor services
    const servicesResult = await db
      .prepare('SELECT * FROM services WHERE provider_id = ?') // Use services table
      .bind(providerId)
      .all<ServiceDb>(); // Fetch all matching services
    // --- End of FIX ---

    // --- FIX: Use D1 prepare/bind/all for reviews (JOIN through services) ---
    // Fetch vendor reviews (reviews linked to the vendor's services)
    const reviewsResult = await db
      .prepare(`
        SELECT r.*, u.first_name || ' ' || u.last_name as user_name
        FROM reviews r
        JOIN services s ON r.service_id = s.id
        JOIN users u ON r.user_id = u.id
        WHERE s.provider_id = ?
      `)
      .bind(providerId)
      .all<ReviewDb>(); // Fetch all matching reviews
     // --- End of FIX ---

    // Safely parse bank_details
    let parsedBankDetails = vendor.bank_details;
    try {
        if (typeof vendor.bank_details === 'string' && vendor.bank_details.trim() !== '') {
            parsedBankDetails = JSON.parse(vendor.bank_details);
        }
    } catch (e) {
        console.warn(`Failed to parse bank_details JSON for vendor ${providerId}:`, vendor.bank_details);
        // Keep original string or set to null on error
    }


    // Combine results
    const result = {
      ...vendor,
      bank_details: parsedBankDetails,
      services: servicesResult.results || [], // Access results array
      reviews: reviewsResult.results || []    // Access results array
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`Error fetching vendor with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vendor details' },
      { status: 500 }
    );
  }
}

// Update a vendor (Service Provider)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const providerId = parseInt(params.id);
     if (isNaN(providerId)) {
        return NextResponse.json({ success: false, message: 'Invalid Vendor ID' }, { status: 400 });
    }

    // --- FIX: Add type assertion for request body ---
    // Note: Adjust fields based on what's actually updatable in service_providers
    const {
      business_name, address, bank_details
      // Add other fields from UpdateServiceProviderBody if needed
    } = await request.json() as UpdateServiceProviderBody;
    // --- End of FIX ---

    // --- FIX: Use D1 prepare/bind/first to check existence ---
    const existingVendor = await db
      .prepare('SELECT id FROM service_providers WHERE id = ?')
      .bind(providerId)
      .first<{ id: number }>();
    // --- End of FIX ---

    if (!existingVendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    let updateFields: string[] = [];
    let updateValues: any[] = [];

    if (business_name !== undefined) {
      updateFields.push('business_name = ?');
      updateValues.push(business_name);
    }
    if (address !== undefined) {
        updateFields.push('address = ?');
        updateValues.push(address);
    }
    // Add other updatable fields from service_providers here...
    if (bank_details !== undefined) {
      updateFields.push('bank_details = ?');
      updateValues.push(JSON.stringify(bank_details)); // Stringify
    }
    // Note: Updating email/phone might require updating the linked 'users' table

    if (updateFields.length === 0) {
        return NextResponse.json({ success: false, message: 'No valid fields provided for update' }, { status: 400 });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(providerId); // Add ID for WHERE clause

    // --- FIX: Use D1 prepare/bind/run for UPDATE ---
    await db
      .prepare(`UPDATE service_providers SET ${updateFields.join(', ')} WHERE id = ?`)
      .bind(...updateValues)
      .run();
    // --- End of FIX ---

    return NextResponse.json({
      success: true,
      message: 'Vendor updated successfully'
    });
  } catch (error) {
    console.error(`Error updating vendor with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

// Delete a vendor (Service Provider) - CAUTION: This is complex due to dependencies
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
     const providerId = parseInt(params.id);
     if (isNaN(providerId)) {
        return NextResponse.json({ success: false, message: 'Invalid Vendor ID' }, { status: 400 });
    }

    // --- FIX: Use D1 prepare/bind/first to check existence ---
    const existingVendor = await db
        .prepare('SELECT id FROM service_providers WHERE id = ?')
        .bind(providerId)
        .first<{ id: number }>();

    if (!existingVendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }
    // --- End of FIX ---


    // --- FIX: Check for related active bookings via services ---
    // Check if there are any active bookings linked to services provided by this vendor
    const activeBookingsResult = await db
        .prepare(`
            SELECT COUNT(b.id) as count
            FROM bookings b
            JOIN booking_services bs ON b.id = bs.booking_id
            JOIN services s ON bs.service_id = s.id
            WHERE s.provider_id = ? AND b.status NOT IN (?, ?)
        `)
        .bind(providerId, 'cancelled', 'completed') // Adjust statuses as needed
        .first<{ count: number }>();

    const activeBookingsCount = activeBookingsResult?.count ?? 0;
    // --- End of FIX ---

    if (activeBookingsCount > 0) {
      return NextResponse.json(
        { success: false, message: `Cannot delete vendor with ${activeBookingsCount} active bookings linked to their services` },
        { status: 400 }
      );
    }

    // --- FIX: Use D1 prepare/bind/run for DELETE ---
    // Consider implications: deleting services might orphan reviews.
    // Option 1: Delete services (might be too destructive if services are shared?)
    console.warn(`Deleting services associated with provider ID ${providerId}...`);
    await db.prepare('DELETE FROM services WHERE provider_id = ?').bind(providerId).run();

    // Option 2: Delete related reviews (if services are deleted)
    // DELETE r FROM reviews r JOIN services s ON r.service_id = s.id WHERE s.provider_id = ?
    // D1 might not support multi-table delete syntax easily. Fetch service IDs first?

    // Delete the service provider record itself
    await db.prepare('DELETE FROM service_providers WHERE id = ?').bind(providerId).run();
    // --- End of FIX ---

    // Consider deleting the associated user account if it's *only* a vendor?

    return NextResponse.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting vendor with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}