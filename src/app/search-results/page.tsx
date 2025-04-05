// Path: .\src\app\search-results\page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react'; // Import React
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Define types for individual search results
interface SearchResult {
  id: string | number;
  name: string;
  description: string;
  image_url: string;
  price?: number;
  location?: string;
  duration?: string;
  category?: string; // Added category for potential display logic
}

// Define the structure of the nested 'data' object expected in a successful API response
interface ApiSearchData {
  destinations: SearchResult[];
  packages: SearchResult[];
  activities: SearchResult[];
  vendors?: SearchResult[]; // Include vendors if API sends it, even if not used in state
}

// Define the overall API response structure
interface ApiSearchResponse {
  success: boolean;
  data?: ApiSearchData; // Data is optional, might be missing on error
  message?: string;    // Message is optional, might be present on error
}

// Type guard to check for successful API response structure
function isApiSearchSuccessResponse(response: any): response is ApiSearchResponse & { success: true; data: ApiSearchData } {
    return response &&
           response.success === true &&
           typeof response.data === 'object' &&
           response.data !== null &&
           Array.isArray(response.data.destinations) &&
           Array.isArray(response.data.packages) &&
           Array.isArray(response.data.activities);
           // Optionally check for response.data.vendors if needed
}


// --- Main Component Structure ---
export default function SearchResultsPage() {
  return (
    // Use Suspense to handle Next.js navigation mechanics smoothly
    <Suspense fallback={<LoadingSpinner />}>
      <SearchResults />
    </Suspense>
  );
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <span className="ml-2 text-lg">Loading...</span>
  </div>
);

// Component containing the actual logic and rendering
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const destination = searchParams.get('destination') || '';
  const dates = searchParams.get('dates') || '';
  const travelers = searchParams.get('travelers') || '';

  const [loading, setLoading] = useState(true);
  // --- State structure matches the nested 'data' object from API ---
  const [results, setResults] = useState<ApiSearchData>({
    destinations: [],
    packages: [],
    activities: [],
    // vendors: [] // Initialize if you plan to use vendor results
  });
  const [error, setError] = useState<string | null>(null); // Add error state

  // Sample data for fallback
   const sampleResults: ApiSearchData = {
      destinations: [ { id: 'havelock-island', name: 'Havelock Island (Sample)', description: 'Sample description.', image_url: '/images/havelock.jpg', location: 'Andaman Islands', category: 'destination' } ],
      packages: [ { id: 101, name: 'Andaman Explorer (Sample)', description: 'Sample package.', image_url: '/images/placeholder.jpg', price: 35000, duration: '7 days', category: 'package' } ],
      activities: [ { id: 201, name: 'Scuba Diving (Sample)', description: 'Sample activity.', image_url: '/images/scuba.jpg', price: 4500, duration: '3 hours', category: 'activity' } ]
    };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null); // Reset error on new search
      try {
        // Construct query parameters, ensuring empty ones are handled cleanly
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (destination) params.set('destination', destination);
        if (dates) params.set('dates', dates);
        if (travelers) params.set('travelers', travelers);

        console.log(`Fetching search results for: /api/search?${params.toString()}`); // Debug log
        const response = await fetch(`/api/search?${params.toString()}`);

        // --- FIX: Type assertion and structure validation ---
        const parsedData: unknown = await response.json(); // Parse as unknown
         console.log("API Response Data:", parsedData); // Debug log

        if (!response.ok) {
           // Attempt to get error message from body
           const errorResponse = parsedData as Partial<ApiSearchResponse>; // Try casting to error shape
           const message = errorResponse?.message || `HTTP error! Status: ${response.status}`;
           console.error("API HTTP Error:", message, parsedData); // Log full data
           throw new Error(message);
        }

        // Use type guard to check if it's a successful response
        if (isApiSearchSuccessResponse(parsedData)) {
           console.log("API Success Response Data:", parsedData.data); // Debug log
          // Set the state with the *nested* data object
           setResults(parsedData.data); // This should now be type-correct
           // Check if the nested data itself is empty
           const noResultsFound = parsedData.data.destinations.length === 0 &&
                                 parsedData.data.packages.length === 0 &&
                                 parsedData.data.activities.length === 0;
           if (noResultsFound) {
               console.log("API returned success but no results found.");
               // Optionally, keep the empty arrays or use sample data here
               // setResults(sampleResults); // Uncomment to show samples on no results
           }
        } else {
           // Response was ok, but didn't match success structure (e.g., success: false)
           const errorResponse = parsedData as Partial<ApiSearchResponse>;
           const message = errorResponse?.message || 'Received invalid data structure from API.';
           console.error("API Logic Error or Invalid Structure:", message, parsedData); // Log full data
           throw new Error(message);
        }
        // --- End of FIX ---

      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during search.');
        // Fallback to sample data on error
        setResults(sampleResults); // Use sample data on error
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  // Depend on search parameters to refetch when they change
  }, [query, destination, dates, travelers]);

  const hasResults = results.destinations.length > 0 ||
                    results.packages.length > 0 ||
                    results.activities.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Summary */}
      <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">Search Results</h1>
         <div className="flex flex-wrap gap-2 text-sm">
           {/* Display active filters */}
           {query && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">"{query}"</span>}
           {destination && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Destination: {destination}</span>}
           {dates && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Dates: {dates}</span>}
           {travelers && <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Travelers: {travelers}</span>}
         </div>
      </div>

      {loading ? (
        <LoadingSpinner /> // Use the spinner component
      ) : error ? (
          // Display error message and fallback results
          <div className="mb-8">
              <div className="p-4 mb-6 rounded-md bg-red-50 text-red-700 border border-red-200">
                  <h3 className="font-medium">Search Error</h3>
                  <p>{error}</p>
                  <p className="mt-2 text-sm">Displaying sample results instead.</p>
              </div>
              {/* Render the fallback results (which are now in the 'results' state) */}
              <SearchResultsDisplay results={results} />
          </div>
      ) : !hasResults ? (
        // No results found message
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No results found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or explore our popular destinations below.</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"> Back to Home </Link>
        </div>
      ) : (
        // Display actual/fallback results
         <SearchResultsDisplay results={results} />
      )}
    </div>
  );
}

// --- Separate component for displaying results ---
interface SearchResultsDisplayProps {
    results: ApiSearchData;
}

const SearchResultsDisplay = ({ results }: SearchResultsDisplayProps) => {
    const hasAnyResults = results.destinations.length > 0 || results.packages.length > 0 || results.activities.length > 0;

    if (!hasAnyResults) {
        // This case might be handled by the parent, but added defensively
        return <div className="text-center py-10"><p className="text-gray-500">No items to display.</p></div>;
    }

    return (
        <div className="space-y-12">
          {/* Destinations Section */}
          {results.destinations.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Destinations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {results.destinations.map((item) => (
                   <div key={`dest-${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                     <div className="h-48 relative"> <Image src={item.image_url || '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" /> </div>
                     <div className="p-6"> <h3 className="text-xl font-semibold mb-2">{item.name}</h3> <p className="text-gray-600 mb-2">{item.location}</p> <p className="text-gray-700 mb-4 line-clamp-3">{item.description}</p> <Link href={`/destinations/${item.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"> Explore </Link> </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Packages Section */}
          {results.packages.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Travel Packages</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {results.packages.map((item) => (
                   <div key={`pkg-${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                     <div className="h-48 relative"> <Image src={item.image_url || '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" /> </div>
                     <div className="p-6"> <h3 className="text-xl font-semibold mb-2">{item.name}</h3> <p className="text-gray-600 mb-2">{item.duration}</p> <p className="text-gray-700 mb-3 line-clamp-3">{item.description}</p> <p className="text-lg font-bold text-blue-600 mb-4">₹{item.price?.toLocaleString()}</p> <Link href={`/packages/${item.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"> View Details </Link> </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Activities Section */}
          {results.activities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Activities</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {results.activities.map((item) => (
                   <div key={`act-${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                     <div className="h-48 relative"> <Image src={item.image_url || '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" /> </div>
                     <div className="p-6"> <h3 className="text-xl font-semibold mb-2">{item.name}</h3> <p className="text-gray-600 mb-2">{item.duration}</p> <p className="text-gray-700 mb-3 line-clamp-3">{item.description}</p> <p className="text-lg font-bold text-blue-600 mb-4">₹{item.price?.toLocaleString()}</p> <Link href={`/activities/${item.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"> Book Now </Link> </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
    );
}