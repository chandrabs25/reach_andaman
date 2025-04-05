// Path: .\src\app\api\availability\route.ts
import { NextRequest, NextResponse } from 'next/server';

// --- Define the type for the keys of unavailablePackages ---
type UnavailablePackageKey = 'pkg_havelock_adventure' | 'pkg_neil_island_getaway';

// --- Define the structure of unavailablePackages explicitly ---
const unavailablePackages: Record<UnavailablePackageKey, string[]> = {
  'pkg_havelock_adventure': ['2025-05-01', '2025-05-02', '2025-05-03'],
  'pkg_neil_island_getaway': ['2025-06-15', '2025-06-16', '2025-06-17'],
};


export async function GET(request: NextRequest) {
  try {
    // Get query parameters
     const packageId = request.nextUrl.searchParams.get('packageId');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const guestsParam = request.nextUrl.searchParams.get('guests'); // Renamed to avoid conflict

    if (!packageId || !startDate || !endDate || !guestsParam) {
      return NextResponse.json(
        { message: 'Missing required parameters: packageId, startDate, endDate, guests' },
        { status: 400 }
      );
    }

    const guests = parseInt(guestsParam); // Parse guests here
     if (isNaN(guests)) {
        return NextResponse.json(
          { message: 'Invalid parameter: guests must be a number' },
          { status: 400 }
        );
     }


    // In a real implementation, this would check against the database
    // For demonstration, we'll return mock availability data
    const isAvailable = checkAvailabilityMock(packageId, startDate, endDate, guests);

    if (!isAvailable) {
      return NextResponse.json(
        {
          available: false,
          message: 'The selected package is not available for the specified dates or number of guests',
          alternativeDates: generateAlternativeDates(startDate, endDate)
        },
        { status: 200 } // Still 200 OK, just indicating unavailability
      );
    }

    // Calculate mock pricing based on guests
    const basePricePerGuest = 12500;
    const taxesPerGuest = 2500;
    const totalAmountPerGuest = basePricePerGuest + taxesPerGuest;

    return NextResponse.json(
      {
        available: true,
        message: 'The selected package is available for booking',
        packageId,
        startDate,
        endDate,
        guests: guests, // Use the parsed number
        pricing: {
          basePrice: basePricePerGuest * guests,
          taxes: taxesPerGuest * guests,
          totalAmount: totalAmountPerGuest * guests
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { message: 'Failed to check availability', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Mock function to check availability
function checkAvailabilityMock(packageId: string, startDate: string, endDate: string, guests: number): boolean {
  // Check if the package exists as a key in our typed object
  // Using `hasOwnProperty` is slightly safer than `in` as it avoids prototype chain lookups
  if (Object.prototype.hasOwnProperty.call(unavailablePackages, packageId)) {

    // --- FIX: Use type assertion here ---
    // We know packageId is a valid key because of the check above
    const unavailableDates = unavailablePackages[packageId as UnavailablePackageKey];
    // --- End of FIX ---

    // Parse start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if any day in the range is unavailable
    // Ensure loop handles date boundaries correctly
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
       // Clone the date to avoid modifying the original loop variable directly inside toISOString
       const currentDate = new Date(day);
      const dateString = currentDate.toISOString().split('T')[0];
      if (unavailableDates.includes(dateString)) {
        return false; // Found an unavailable date in the range
      }
    }
  }

  // Check if guest count is within limits (mock logic)
  if (guests > 10) {
    return false;
  }

  // If no specific unavailability is found, assume it's available
  return true;
}

// Generate alternative dates for unavailable packages
function generateAlternativeDates(startDate: string, endDate: string): Array<{startDate: string, endDate: string}> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Calculate duration in days (inclusive)
   const durationInMs = end.getTime() - start.getTime();
   const durationInDays = Math.round(durationInMs / (1000 * 60 * 60 * 24)); // Calculate difference in days

  // Generate 3 alternative date ranges
  const alternatives = [];

  for (let i = 1; i <= 3; i++) {
     const offsetWeeks = i * 7; // Add 1, 2, or 3 weeks
     const altStart = new Date(start);
     altStart.setDate(altStart.getDate() + offsetWeeks);

     const altEnd = new Date(altStart);
     altEnd.setDate(altEnd.getDate() + durationInDays); // Add the original duration

     alternatives.push({
       startDate: altStart.toISOString().split('T')[0],
       endDate: altEnd.toISOString().split('T')[0]
     });
  }


  return alternatives;
}