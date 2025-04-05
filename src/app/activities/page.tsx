'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Define the structure of a single activity
interface Activity {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  destination_name: string; // Assuming your API will provide this
}

// Define the structure of the expected API response
interface ApiResponse {
  success: boolean;
  data?: Activity[]; // Data is optional, might be missing on error or if empty
  message?: string;  // Message is optional, might be missing on success
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true); // Keep true as we intend to fetch
  const [error, setError] = useState<string | null>(null); // State to hold fetch errors

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true); // Ensure loading is true when fetching starts
      setError(null); // Reset error state on new fetch attempt
      try {
        const response = await fetch('/api/activities');

        // Check for network errors or non-2xx status codes
         if (!response.ok) {
          // Try to get error message from response body, else use status text
          let errorMessage = `HTTP error! status: ${response.status} ${response.statusText || ''}`.trim();
          try {
            // ----> Add checks for errorData structure <----
            const errorData: unknown = await response.json(); // Parse as unknown first
            // Check if it's an object, not null, has 'message', and 'message' is a string
            if (
              typeof errorData === 'object' &&
              errorData !== null &&
              'message' in errorData &&
              typeof (errorData as { message?: unknown }).message === 'string' // Type assertion within check
            ) {
              // If checks pass, safely use the message property
              errorMessage = (errorData as { message: string }).message || errorMessage;
            }
            // ----> End checks <----
          } catch (jsonError) {
            // Ignore if response body isn't valid JSON or parsing fails
             console.warn("Could not parse error response body as JSON:", jsonError);
          }
          // Throw the error with the potentially extracted message
          throw new Error(errorMessage);
        }

        // Assert the type of the *success* JSON data
        const data = await response.json() as ApiResponse;

        if (data.success) {
          // Set activities if data exists, otherwise keep it empty
          setActivities(data.data || []);
        } else {
          // Handle API-level errors (e.g., { success: false, message: '...' })
          const apiErrorMessage = data.message || 'Failed to fetch activities due to an API error.';
          console.error('API Error:', apiErrorMessage);
          setError(apiErrorMessage); // Set error state to display to user
          setActivities(sampleActivities); // Fallback to sample data on API error
        }
      } catch (error) {
        // Handle network errors, JSON parsing errors, or thrown errors
        console.error('Fetch Error:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred during fetch.';
        setError(message); // Set error state
        setActivities(sampleActivities); // Fallback to sample data on fetch error
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    }

    fetchActivities();
  }, []); // Empty dependency array ensures this runs once on mount

  // Sample activities for development (used as fallback)
  const sampleActivities: Activity[] = [
    {
      id: 1,
      name: 'Scuba Diving',
      description: 'Explore the vibrant underwater world of Andaman with professional diving instructors.',
      price: 3500,
      duration: '3 hours',
      image_url: '/images/scuba.jpg',
      destination_name: 'Havelock Island'
    },
    {
      id: 2,
      name: 'Sea Walking',
      description: 'Walk on the ocean floor and experience the marine life up close without diving skills.',
      price: 2500,
      duration: '2 hours',
      image_url: '/images/sea-walking.jpg',
      destination_name: 'North Bay Island'
    },
    {
      id: 3,
      name: 'Jet Skiing',
      description: 'Feel the adrenaline rush as you zoom across the crystal clear waters on a jet ski.',
      price: 1500,
      duration: '30 minutes',
      image_url: '/images/jet-ski.jpg',
      destination_name: 'Corbyn\'s Cove Beach'
    },
    {
      id: 4,
      name: 'Glass Bottom Boat Ride',
      description: 'View the colorful coral reefs and marine life through a glass bottom boat without getting wet.',
      price: 1200,
      duration: '1 hour',
      image_url: '/images/glass-boat.jpg',
      destination_name: 'North Bay Island'
    },
    {
      id: 5,
      name: 'Trekking',
      description: 'Trek through the lush forests of Andaman and discover hidden waterfalls and viewpoints.',
      price: 1800,
      duration: '4 hours',
      image_url: '/images/trekking.jpg',
      destination_name: 'Mount Harriet'
    },
    {
      id: 6,
      name: 'Snorkeling',
      description: 'Explore the shallow coral reefs and colorful fish with basic snorkeling equipment.',
      price: 1500,
      duration: '2 hours',
      image_url: '/images/snorkeling.jpg',
      destination_name: 'Elephant Beach'
    }
  ];

  // Determine which data to display: API data if available and successful, otherwise sample data.
  // If there was an error OR if the API returned success:false OR success:true with empty data,
  // we use sampleActivities. Otherwise, use the fetched activities.
  // const displayActivities = error || activities.length === 0 ? sampleActivities : activities;
  // Let's refine this: Show API data if successful, otherwise show samples *if* there was an error.
  const displayActivities = activities; // Primarily show fetched data

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-green-900 h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-700">
          <Image
            src="/images/activities-hero.jpg"
            alt="Andaman Activities"
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
        </div>

        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Exciting Andaman Activities
          </h1>
          <p className="text-xl text-white text-center max-w-2xl">
            Experience thrilling adventures and create unforgettable memories
          </p>
        </div>
      </div>

      {/* Activities List */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-lg">Loading activities...</span>
          </div>
        ) : error ? (
            // Display error message if fetch failed
            <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 font-medium">Could not load activities.</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-gray-600 text-sm mt-3">Displaying sample activities instead.</p>
                {/* Optionally render sample data here too if desired during error */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                    {sampleActivities.map((activity) => (
                      <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                        {/* ... card content ... */}
                         <div className="h-56 bg-green-200 relative">
                          <Image
                            src={activity.image_url || '/images/placeholder.jpg'}
                            alt={activity.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h2 className="text-2xl font-semibold mb-2">{activity.name}</h2>
                          <p className="text-gray-600 mb-4">Location: {activity.destination_name}</p>
                          <p className="text-gray-700 mb-4">{activity.description}</p>

                          <div className="flex justify-between items-center mb-4">
                            <div className="text-green-700 font-semibold">₹{activity.price} per person</div>
                            <div className="text-gray-600">{activity.duration}</div>
                          </div>

                          <Link
                            href={`/activities/${activity.id}`}
                            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    ))}
                 </div>
            </div>
        ) : (
          // Display fetched activities or a 'no activities' message
          displayActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                  <div className="h-56 bg-green-200 relative">
                    <Image
                      src={activity.image_url || '/images/placeholder.jpg'}
                      alt={activity.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2">{activity.name}</h2>
                    <p className="text-gray-600 mb-4">Location: {activity.destination_name}</p>
                    <p className="text-gray-700 mb-4">{activity.description}</p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-green-700 font-semibold">₹{activity.price} per person</div>
                      <div className="text-gray-600">{activity.duration}</div>
                    </div>

                    <Link
                      href={`/activities/${activity.id}`} // Ensure this route exists or adjust
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
           ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No activities found matching your criteria.</p>
              {/* Optionally show sample data here as well if API returns empty */}
              {/* <p className="text-gray-500 mt-2">Showing some popular options:</p> */}
              {/* Render sampleActivities grid here if desired */}
            </div>
           )
        )}
      </div>
    </>
  );
}