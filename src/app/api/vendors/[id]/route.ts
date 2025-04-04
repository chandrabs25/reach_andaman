

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
export const runtime = 'edge';
// Get a specific vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch vendor
    const vendor = await db.execute(
      'SELECT * FROM vendors WHERE id = ? AND is_approved = 1',
      [id]
    );
    
    if (!vendor || vendor.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Fetch vendor services
    const services = await db.execute(
      'SELECT * FROM vendor_services WHERE vendor_id = ?',
      [id]
    );
    
    // Fetch vendor reviews
    const reviews = await db.execute(
      'SELECT r.*, u.name as user_name FROM vendor_reviews r JOIN users u ON r.user_id = u.id WHERE r.vendor_id = ?',
      [id]
    );
    
    // Parse JSON fields
    const result = {
      ...vendor[0],
      bank_details: vendor[0].bank_details ? JSON.parse(vendor[0].bank_details) : null,
      services,
      reviews
    };
    
    return NextResponse.json({ 
      success: true, 
      data: result
    });
  } catch (error) {
    console.error(`Error fetching vendor with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}

// Update a vendor (vendor owner or admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { 
      name,
      description,
      contact_email,
      contact_phone,
      website,
      bank_details
    } = await request.json();
    
    // Check if vendor exists
    const existingVendor = await db.execute(
      'SELECT * FROM vendors WHERE id = ?',
      [id]
    );
    
    if (!existingVendor || existingVendor.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
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
    
    if (contact_email) {
      updateFields.push('contact_email = ?');
      updateValues.push(contact_email);
    }
    
    if (contact_phone) {
      updateFields.push('contact_phone = ?');
      updateValues.push(contact_phone);
    }
    
    if (website) {
      updateFields.push('website = ?');
      updateValues.push(website);
    }
    
    if (bank_details) {
      updateFields.push('bank_details = ?');
      updateValues.push(JSON.stringify(bank_details));
    }
    
    // Add ID to values array
    updateValues.push(id);
    
    // Execute update
    await db.execute(
      `UPDATE vendors SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
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

// Delete a vendor (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if vendor exists
    const existingVendor = await db.execute(
      'SELECT * FROM vendors WHERE id = ?',
      [id]
    );
    
    if (!existingVendor || existingVendor.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Check if there are any active bookings for this vendor
    const activeBookings = await db.execute(
      'SELECT COUNT(*) as count FROM bookings WHERE vendor_id = ? AND status != "cancelled"',
      [id]
    );
    
    if (activeBookings[0].count > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete vendor with active bookings' },
        { status: 400 }
      );
    }
    
    // Delete vendor services first
    await db.execute(
      'DELETE FROM vendor_services WHERE vendor_id = ?',
      [id]
    );
    
    // Delete vendor
    await db.execute(
      'DELETE FROM vendors WHERE id = ?',
      [id]
    );
    
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
