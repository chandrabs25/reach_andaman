// Path: .\src\app\destinations\page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import React
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Define interface for a single Destination
interface Destination {
  id: string | number; // Allow number or string ID
  name: string;
  description: string;
  location: string;
  image_url: string;
  highlights?: string[]; // Optional, assuming it might be parsed later or come from API
}

// --- Define interfaces for the expected API response ---
interface ApiSuccessResponse {
  success: true;
  data: Destination[]; // Expect an array of Destination objects
}

interface ApiErrorResponse {
  success: false;
  message: string; // Expect a message on error
}

// Type guard to check if the response is successful
function isApiSuccessResponse(response: any): response is ApiSuccessResponse {
    return response && response.success === true && Array.isArray(response.data);
}
// --- End API Response Interfaces ---


export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  // Sample destinations for development (used as fallback on error/empty)
  const sampleDestinations: Destination[] = [
    {
      id: 'havelock-island',
      name: 'Havelock Island',
      description: 'Home to Radhanagar Beach, one of Asia\'s best beaches with pristine white sands and crystal clear waters.',
      location: 'Andaman Islands',
      image_url: '/images/havelock.jpg',
      highlights: ['Radhanagar Beach', 'Elephant Beach', 'Kalapathar Beach']
    },
    {
      id: 'neil-island',
      name: 'Neil Island',
      description: 'Known for its pristine beaches and natural bridge formation, perfect for a relaxing getaway.',
      location: 'Andaman Islands',
      image_url: '/images/neil.jpg',
      highlights: ['Natural Bridge', 'Bharatpur Beach', 'Laxmanpur Beach']
    },
    {
      id: 'port-blair',
      name: 'Port Blair',
      description: 'The capital city with historical Cellular Jail and other colonial remnants.',
      location: 'Andaman Islands',
      image_url: '/images/port_blair.jpg',
      highlights: ['Cellular Jail', 'Ross Island', 'North Bay Island']
    },
    {
      id: 'baratang-island',
      name: 'Baratang Island',
      description: 'Famous for limestone caves and mud volcanoes, offering a unique natural experience.',
      location: 'Andaman Islands',
      image_url: '/images/baratang.jpg',
      highlights: ['Limestone Caves', 'Mud Volcanoes', 'Parrot Island']
    }
  ];


  useEffect(() => {
    async function fetchDestinations() {
      setLoading(true);
      setError(null); // Reset error
      try {
        const response = await fetch('/api/destinations'); // Fetch from your API route

        // --- FIX: Assert type after fetching JSON ---
        const data: unknown = await response.json(); // Fetch as unknown first

        if (!response.ok) {
           // Handle HTTP errors (like 404, 500)
           const errorData = data as ApiErrorResponse; // Assume error structure
           const errorMessage = errorData?.message || `HTTP error! Status: ${response.status}`;
           console.error('API Error:', errorMessage, data); // Log full error data
           throw new Error(errorMessage);
        }

        // Use the type guard to check for success structure
        if (isApiSuccessResponse(data)) {
            setDestinations(data.data || []); // Set fetched data
            if (!data.data || data.data.length === 0) {
                console.log("API returned success but no destinations, using sample data.");
                setDestinations(sampleDestinations); // Use sample if API returns empty array
            }
        } else {
            // Handle cases where response is ok, but success: false
             const errorData = data as ApiErrorResponse; // Assert error type again
             const errorMessage = errorData?.message || 'API returned unsuccessful status.';
             console.error('API Logic Error:', errorMessage, data);
             throw new Error(errorMessage);
        }
        // --- End of FIX ---

      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        // Fallback to sample data on any fetch error
        setDestinations(sampleDestinations);
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []); // Empty dependency array means run once on mount

  // Determine which data to display: API data if fetched successfully and non-empty, otherwise sample data.
  // Since the fallback is handled within the fetch logic now, we can just use the 'destinations' state.
  const displayDestinations = destinations;

  return (
    <>
      {/* Hero Section remains unchanged */}
      <div className="relative bg-blue-900 h-64 md:h-80">
         {/* ... Hero Content ... */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700">
             <Image src="/images/destinations-hero.jpg" alt="Andaman Destinations" fill className="object-cover mix-blend-overlay" priority />
           </div>
           <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
             <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4"> Explore Andaman Destinations </h1>
             <p className="text-xl text-white text-center max-w-2xl"> Discover paradise islands with pristine beaches, vibrant coral reefs, and lush forests </p>
           </div>
      </div>

      {/* Destinations List */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading destinations...</span>
          </div>
        ) : error ? (
            // Display error message
            <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 font-medium">Could not load destinations.</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-gray-600 text-sm mt-3">Displaying sample destinations instead.</p>
                {/* Optionally render sample data here too if desired during error */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                     {sampleDestinations.map((destination) => (
                       <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                           {/* ... card content using sample data ... */}
                             <div className="h-56 bg-blue-200 relative"> <Image src={destination.image_url || '/images/placeholder.jpg'} alt={destination.name} fill className="object-cover" /> </div>
                             <div className="p-6">
                               <h2 className="text-2xl font-semibold mb-2">{destination.name}</h2>
                               <p className="text-gray-600 mb-4">{destination.location}</p>
                               <p className="text-gray-700 mb-4">{destination.description}</p>
                               {/* ... Highlights ... */}
                                {destination.highlights && destination.highlights.length > 0 && ( <div className="mb-4"> <h3 className="text-lg font-medium mb-2">Highlights:</h3> <ul className="list-disc list-inside text-gray-700"> {destination.highlights.map((highlight, index) => ( <li key={index}>{highlight}</li> ))} </ul> </div> )}
                               <Link href={`/destinations/${destination.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"> Explore More </Link>
                             </div>
                       </div>
                     ))}
                  </div>
            </div>
        ) : (
          // Display fetched/sample destinations
           displayDestinations.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {displayDestinations.map((destination) => (
                   <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                     {/* ... Card content using displayDestinations ... */}
                        <div className="h-56 bg-blue-200 relative"> <Image src={destination.image_url || '/images/placeholder.jpg'} alt={destination.name} fill className="object-cover" /> </div>
                        <div className="p-6">
                           <h2 className="text-2xl font-semibold mb-2">{destination.name}</h2>
                           <p className="text-gray-600 mb-4">{destination.location}</p>
                           <p className="text-gray-700 mb-4">{destination.description}</p>
                           {/* ... Highlights ... */}
                            {destination.highlights && destination.highlights.length > 0 && ( <div className="mb-4"> <h3 className="text-lg font-medium mb-2">Highlights:</h3> <ul className="list-disc list-inside text-gray-700"> {destination.highlights.map((highlight, index) => ( <li key={index}>{highlight}</li> ))} </ul> </div> )}
                           <Link href={`/destinations/${destination.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"> Explore More </Link>
                        </div>
                   </div>
                 ))}
               </div>
            ) : (
               // This case might not be reached if sample data is always used as fallback
               <div className="text-center py-10">
                  <p className="text-gray-500">No destinations available at the moment.</p>
               </div>
            )
        )}
      </div>
    </>
  );
}