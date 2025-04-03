import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    // In a real implementation, this would fetch from the database
    // For demonstration, we'll return mock data
    const booking = {
      id: bookingId,
      packageId: 'pkg_havelock_adventure',
      packageName: 'Havelock Island Adventure',
      userId: 'user_123',
      userName: 'Rahul Sharma',
      userEmail: 'rahul.s@example.com',
      userPhone: '9876543210',
      vendorId: 'vendor_456',
      vendorName: 'Andaman Adventures',
      vendorEmail: 'info@andamanadventures.com',
      vendorPhone: '9876543200',
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      guests: 2,
      amount: 25000,
      status: 'confirmed',
      paymentId: 'pay_123456789',
      paymentStatus: 'completed',
      createdAt: '2025-04-01T10:30:00Z',
      updatedAt: '2025-04-01T11:15:00Z',
      itinerary: [
        {
          day: 1,
          title: 'Arrival at Port Blair',
          description: 'Arrive at Port Blair airport and transfer to hotel. Visit Cellular Jail and attend the Light and Sound show in the evening.'
        },
        {
          day: 2,
          title: 'Port Blair to Havelock Island',
          description: 'Morning ferry to Havelock Island. Check-in at resort and relax at Radhanagar Beach.'
        },
        {
          day: 3,
          title: 'Scuba Diving Day',
          description: 'Full day scuba diving experience at Elephant Beach with certified instructors.'
        },
        {
          day: 4,
          title: 'Havelock Island Exploration',
          description: 'Visit Kalapathar Beach in the morning. Afternoon kayaking in mangroves.'
        },
        {
          day: 5,
          title: 'Havelock to Port Blair',
          description: 'Morning ferry back to Port Blair. Visit Chidiya Tapu for sunset views.'
        },
        {
          day: 6,
          title: 'Departure',
          description: 'Transfer to airport for departure flight.'
        }
      ]
    };
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Failed to fetch booking', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const updateData = await request.json();
    
    // In a real implementation, this would update the database
    // For demonstration, we'll return mock data
    const updatedBooking = {
      id: bookingId,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: 'Failed to update booking', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    // In a real implementation, this would delete from the database or mark as cancelled
    // For demonstration, we'll return success
    
    return NextResponse.json(
      { message: 'Booking cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { message: 'Failed to cancel booking', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
