'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
export const runtime = 'edge';
// Get all vendors or filter by type/location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const minRating = searchParams.get('minRating');
    
    // Build query based on filters
    let query = 'SELECT * FROM vendors WHERE is_approved = 1';
    let params = [];
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (location) {
      query += ' AND location = ?';
      params.push(location);
    }
    
    if (minRating) {
      query += ' AND rating >= ?';
      params.push(minRating);
    }
    
    const vendors = await db.execute(query, params);
    
    // For each vendor, get their services
    const vendorsWithServices = await Promise.all(
      vendors.map(async (vendor) => {
        const services = await db.execute(
          'SELECT * FROM vendor_services WHERE vendor_id = ?',
          [vendor.id]
        );
        
        return {
          ...vendor,
          services
        };
      })
    );
    
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

// Register a new vendor (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const { 
      name,
      type,
      location,
      description,
      contact_email,
      contact_phone,
      website,
      services,
      business_license,
      bank_details
    } = await request.json();
    
    // Validation
    if (!name || !type || !location || !description || !contact_email || !contact_phone) {
      return NextResponse.json(
        { success: false, message: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Insert vendor into database
    const result = await db.execute(
      `INSERT INTO vendors (
        name, type, location, description, contact_email, 
        contact_phone, website, business_license, bank_details,
        is_approved, rating, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        name, type, location, description, contact_email,
        contact_phone, website, business_license, JSON.stringify(bank_details),
        0, 0 // Default values for is_approved and rating
      ]
    );
    
    const vendorId = result.meta.last_row_id;
    
    // Insert vendor services
    if (services && services.length > 0) {
      for (const service of services) {
        await db.execute(
          `INSERT INTO vendor_services (
            vendor_id, name, description, price, image_url
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            vendorId, service.name, service.description, service.price, service.image_url
          ]
        );
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Vendor registration submitted successfully. Pending approval.',
      data: { id: vendorId }
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering vendor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register vendor' },
      { status: 500 }
    );
  }
}
