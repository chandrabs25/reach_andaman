'use server';

import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

// This is a route handler to handle direct requests to /search
// It redirects to the search results page with the query parameters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const destination = searchParams.get('destination') || '';
  const dates = searchParams.get('dates') || '';
  const travelers = searchParams.get('travelers') || '';
  
  // Redirect to the search-results page with the same query parameters
  return NextResponse.redirect(new URL(`/search-results?q=${query}&destination=${destination}&dates=${dates}&travelers=${travelers}`, request.url));
}
