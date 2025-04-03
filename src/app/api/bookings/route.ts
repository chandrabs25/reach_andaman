import { NextRequest, NextResponse } from 'next/server';

// In a real implementation, this would interact with a database
// For now, we'll use in-memory storage for demonstration
let bookings = [];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status');
    
    // Filter bookings based on query parameters
    let filteredBookings = [...bookings];
    
    if (userId) {
      filteredBookings = filteredBookings.filter(booking => booking.userId === userId);
    }
    
    if (vendorId) {
      filteredBookings = filteredBookings.filter(booking => booking.vendorId === vendorId);
    }
    
    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    return NextResponse.json({ bookings: filteredBookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch bookings', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['packageId', 'userId', 'vendorId', 'startDate', 'endDate', 'guests', 'amount'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check availability (in a real implementation, this would query the database)
    const isAvailable = await checkAvailability(
      bookingData.packageId,
      bookingData.startDate,
      bookingData.endDate,
      bookingData.guests
    );
    
    if (!isAvailable) {
      return NextResponse.json(
        { message: 'The selected dates or package is not available' },
        { status: 409 }
      );
    }
    
    // Create new booking
    const newBooking = {
      id: `booking_${Date.now()}`,
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save booking (in a real implementation, this would save to the database)
    bookings.push(newBooking);
    
    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Failed to create booking', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to check availability
async function checkAvailability(packageId: string, startDate: string, endDate: string, guests: number): Promise<boolean> {
  // In a real implementation, this would check against the database
  // For demonstration, we'll assume availability
  return true;
}
