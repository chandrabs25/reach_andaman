// src/app/api/activities/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';

// Return an empty array or mock structure matching your frontend expectation
export async function GET(request: NextRequest) {
  console.log("Accessed STUB /api/activities GET handler");
  try {
    // Return an empty array that matches the expected structure
    return NextResponse.json({
      success: true,
      data: [] // Return empty array
    });

    /* // Or return some minimal mock data if needed for basic testing
    return NextResponse.json({
      success: true,
      data: [
        { id: 999, name: 'Mock Activity', description: 'Placeholder', price: 100, duration: '1 hr', image_url: '/images/placeholder.jpg', destination_name: 'Mock Island' }
      ]
    });
    */
  } catch (error) {
    console.error('Error in stub activities API:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch activities (stub)' },
      { status: 500 }
    );
  }
}