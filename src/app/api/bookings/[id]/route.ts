// Path: .\src\app\api\bookings\[id]\route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET function remains unchanged...
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    // In a real implementation, this would fetch from the database
    // For demonstration, we'll return mock data
    // Fetch from DB using D1 syntax would look something like:
    /*
    const bookingResult = await db.prepare(`
      SELECT b.*, p.name as packageName, u.first_name, u.last_name, u.email as userEmail, u.phone as userPhone,
             sp.business_name as vendorName, sp_user.email as vendorEmail, sp_user.phone as vendorPhone
      FROM bookings b
      LEFT JOIN packages p ON b.package_id = p.id
      JOIN users u ON b.user_id = u.id
      LEFT JOIN service_providers sp ON p.created_by = sp.user_id -- Assuming package creator is vendor
      LEFT JOIN users sp_user ON sp.user_id = sp_user.id
      WHERE b.id = ?
    `).bind(bookingId).first<any>(); // Define a specific type if possible

    if (!bookingResult) {
        return NextResponse.json(
          { message: 'Booking not found' },
          { status: 404 }
        );
    }
    // Adjust mock data structure or DB query to match this if needed
    */

    const booking = {
      id: bookingId,
      packageId: 'pkg_havelock_adventure',
      packageName: 'Havelock Island Adventure',
      userId: 'user_123',
      userName: 'Rahul Sharma',
      userEmail: 'rahul.s@example.com',
      userPhone: '9876543210',
      vendorId: 'vendor_456', // This might need adjustment based on actual data source
      vendorName: 'Andaman Adventures',
      vendorEmail: 'info@andamanadventures.com',
      vendorPhone: '9876543200',
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      guests: 2, // Schema has total_people as TEXT, might need parsing/adjustment
      amount: 25000,
      status: 'confirmed',
      paymentId: 'pay_123456789', // Example, might be in payment_details
      paymentStatus: 'completed', // Schema field name
      createdAt: '2025-04-01T10:30:00Z',
      updatedAt: '2025-04-01T11:15:00Z',
      itinerary: [ // This is likely derived data or stored in package, not booking itself
        // ... itinerary items ...
      ],
      special_requests: null // Example based on schema
    };


    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Failed to fetch booking', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


// --- PUT function with FIX ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    // --- FIX: Add type assertion ---
    const updateData = await request.json() as Record<string, any>; // Assert as a generic object
    // --- End of FIX ---

    // In a real implementation, this would update the database
    // Example using D1 syntax (adapt fields as needed):
    /*
    const fieldsToUpdate = Object.keys(updateData);
    if (fieldsToUpdate.length === 0) {
        return NextResponse.json({ message: 'No update data provided' }, { status: 400 });
    }
    // Add updated_at automatically
    fieldsToUpdate.push('updated_at');
    updateData['updated_at'] = 'CURRENT_TIMESTAMP'; // D1 understands this

    const setClauses = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
    const values = fieldsToUpdate.map(field => updateData[field]);
    values.push(bookingId); // For the WHERE clause

    const result = await db.prepare(`UPDATE bookings SET ${setClauses} WHERE id = ?`)
                         .bind(...values)
                         .run();

    if (result.meta?.changes === 0) {
        // Optional: Check if the row actually existed and was updated
         return NextResponse.json({ message: 'Booking not found or no changes made' }, { status: 404 });
    }

    // Optionally fetch the updated record to return it
     const updatedBookingResult = await db.prepare('SELECT * FROM bookings WHERE id = ?')
                                         .bind(bookingId)
                                         .first<any>(); // Use specific type

     return NextResponse.json({ booking: updatedBookingResult }, { status: 200 });

    */

    // For demonstration, we'll return mock data merged with updateData
    const mockExistingData = { // Simulate data that might exist before update
        packageId: 'pkg_havelock_adventure',
        userId: 'user_123',
        startDate: '2025-05-15',
        endDate: '2025-05-20',
        guests: 2,
        amount: 25000,
        status: 'pending', // Example initial status
        paymentStatus: 'pending',
        createdAt: '2025-04-01T10:30:00Z',
    };

    const updatedBooking = {
        ...mockExistingData, // Spread existing data first (optional, depends on desired return)
        id: bookingId,
        ...updateData, // Spread the update data from the request
        updatedAt: new Date().toISOString() // Override updatedAt
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
// --- End of PUT function ---


// DELETE function remains unchanged...
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    // In a real implementation, this would delete from the database or mark as cancelled
    // Example D1 syntax:
    /*
     await db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
             .bind('cancelled', bookingId) // Example: Update status to 'cancelled'
             .run();
    // Or: await db.prepare('DELETE FROM bookings WHERE id = ?').bind(bookingId).run();
    */

    // For demonstration, we'll return success
    return NextResponse.json(
      { message: 'Booking cancelled successfully' },
      { status: 200 } // Use 200 OK or 204 No Content
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { message: 'Failed to cancel booking', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}