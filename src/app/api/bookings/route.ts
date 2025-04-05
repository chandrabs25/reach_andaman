// Path: .\src\app\api\bookings\route.ts
import { NextRequest, NextResponse } from 'next/server';

// --- FIX: Define an interface for the Booking object ---
interface Booking {
  id: string; // Example uses string ID like `booking_${Date.now()}`
  packageId: string; // Assuming string based on usage
  userId: string; // Assuming string based on usage
  vendorId: string; // Used in POST, keep for mock consistency
  startDate: string; // Date string
  endDate: string; // Date string
  guests: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // Possible statuses
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  // Add other potential fields from schema if needed for GET filters, though not strictly required by POST
  packageName?: string; // Example
  paymentStatus?: string;
}
// --- End of FIX ---

// In a real implementation, this would interact with a database
// For now, we'll use in-memory storage for demonstration
// --- FIX: Explicitly type the bookings array ---
let bookings: Booking[] = [];
// --- End of FIX ---

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vendorId = searchParams.get('vendorId'); // Used for filtering the mock
    const status = searchParams.get('status');

    // Filter bookings based on query parameters
    let filteredBookings = [...bookings];

    if (userId) {
      // Ensure comparison uses the correct type if necessary, strings here
      filteredBookings = filteredBookings.filter(booking => booking.userId === userId);
    }

    if (vendorId) {
      // Ensure comparison uses the correct type if necessary, strings here
      filteredBookings = filteredBookings.filter(booking => booking.vendorId === vendorId);
    }

    if (status) {
      // Ensure status comparison works with the defined statuses in the interface
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

// --- Define expected request body type ---
interface BookingRequestBody {
    packageId: string;
    userId: string;
    vendorId: string;
    startDate: string;
    endDate: string;
    guests: number;
    amount: number;
    // Add any other fields expected in the request body
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json() as BookingRequestBody; // Use type assertion

    // Validate required fields from the request body
    const requiredFields: (keyof BookingRequestBody)[] = ['packageId', 'userId', 'vendorId', 'startDate', 'endDate', 'guests', 'amount'];
    const missingFields = requiredFields.filter(field => !(field in bookingData) || !bookingData[field]);

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
        { status: 409 } // Use 409 Conflict
      );
    }

    // Create new booking - Ensure this conforms to the Booking interface
    const newBooking: Booking = {
      id: `booking_${Date.now()}`, // Ensure ID type matches interface
      packageId: bookingData.packageId,
      userId: bookingData.userId,
      vendorId: bookingData.vendorId, // Make sure vendorId is included if it's part of Booking interface
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      guests: bookingData.guests,
      amount: bookingData.amount,
      status: 'pending', // Default status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
      // Add other fields like packageName if needed and available
    };

    // Save booking (in a real implementation, this would save to the database)
    bookings.push(newBooking);

    // In a real D1 scenario:
    /*
    await db.prepare(`
      INSERT INTO bookings (user_id, package_id, total_people, start_date, end_date, total_amount, status, payment_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      bookingData.userId, // Assuming userId is number in DB
      bookingData.packageId, // Assuming packageId is number in DB
      bookingData.guests.toString(), // Schema has TEXT for total_people
      bookingData.startDate,
      bookingData.endDate,
      bookingData.amount,
      'pending',
      'pending'
    ).run();
    // Fetch the created booking if needed to return it
    */


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
  console.log(`Checking availability for package ${packageId}, ${startDate}-${endDate}, ${guests} guests...`);
  // Add real logic here, e.g., query DB for conflicting bookings
  return true;
}