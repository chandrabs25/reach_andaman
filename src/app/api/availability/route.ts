import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const guests = searchParams.get('guests');
    
    if (!packageId || !startDate || !endDate || !guests) {
      return NextResponse.json(
        { message: 'Missing required parameters: packageId, startDate, endDate, guests' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would check against the database
    // For demonstration, we'll return mock availability data
    const isAvailable = checkAvailabilityMock(packageId, startDate, endDate, parseInt(guests));
    
    if (!isAvailable) {
      return NextResponse.json(
        { 
          available: false,
          message: 'The selected package is not available for the specified dates or number of guests',
          alternativeDates: generateAlternativeDates(startDate, endDate)
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        available: true,
        message: 'The selected package is available for booking',
        packageId,
        startDate,
        endDate,
        guests: parseInt(guests),
        pricing: {
          basePrice: 12500 * parseInt(guests),
          taxes: 2500 * parseInt(guests),
          totalAmount: 15000 * parseInt(guests)
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
  // For demonstration, we'll make some packages unavailable on certain dates
  const unavailablePackages = {
    'pkg_havelock_adventure': ['2025-05-01', '2025-05-02', '2025-05-03'],
    'pkg_neil_island_getaway': ['2025-06-15', '2025-06-16', '2025-06-17'],
  };
  
  // Check if the package exists in our mock data
  if (packageId in unavailablePackages) {
    const unavailableDates = unavailablePackages[packageId];
    
    // Parse start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if any day in the range is unavailable
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const dateString = day.toISOString().split('T')[0];
      if (unavailableDates.includes(dateString)) {
        return false;
      }
    }
  }
  
  // Check if guest count is within limits (mock logic)
  if (guests > 10) {
    return false;
  }
  
  return true;
}

// Generate alternative dates for unavailable packages
function generateAlternativeDates(startDate: string, endDate: string): Array<{startDate: string, endDate: string}> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate 3 alternative date ranges
  const alternatives = [];
  
  // Option 1: One week later
  const alt1Start = new Date(start);
  alt1Start.setDate(alt1Start.getDate() + 7);
  const alt1End = new Date(alt1Start);
  alt1End.setDate(alt1End.getDate() + duration);
  alternatives.push({
    startDate: alt1Start.toISOString().split('T')[0],
    endDate: alt1End.toISOString().split('T')[0]
  });
  
  // Option 2: Two weeks later
  const alt2Start = new Date(start);
  alt2Start.setDate(alt2Start.getDate() + 14);
  const alt2End = new Date(alt2Start);
  alt2End.setDate(alt2End.getDate() + duration);
  alternatives.push({
    startDate: alt2Start.toISOString().split('T')[0],
    endDate: alt2End.toISOString().split('T')[0]
  });
  
  // Option 3: One month later
  const alt3Start = new Date(start);
  alt3Start.setMonth(alt3Start.getMonth() + 1);
  const alt3End = new Date(alt3Start);
  alt3End.setDate(alt3End.getDate() + duration);
  alternatives.push({
    startDate: alt3Start.toISOString().split('T')[0],
    endDate: alt3End.toISOString().split('T')[0]
  });
  
  return alternatives;
}
