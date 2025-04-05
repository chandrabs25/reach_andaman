// Path: .\src\app\destinations\[id]\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react'; // Import loader

// Define interface for Destination data
interface DestinationData {
  id: string;
  name: string;
  description: string;
  image: string;
  highlights: string[];
  activities: string[];
  bestTimeToVisit: string;
  howToReach: string;
}

// Define the type for the keys of mockDestinations explicitly
type MockDestinationKey = 'havelock-island' | 'neil-island' | 'port-blair' | 'baratang-island';


export default function DestinationDetail() {
  const params = useParams();
  const [destination, setDestination] = useState<DestinationData | null>(null); // Use defined interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchDestination = () => { // No need for async for mock data
      setError(null); // Reset error on new fetch attempt
      setLoading(true);
      try {
        const id = params.id; // Type: string | string[] | undefined

        // --- FIX: Validate 'id' is a usable string ---
        if (typeof id !== 'string') {
          console.error('Invalid or missing destination ID parameter:', id);
          setError('Invalid destination ID.');
          setDestination(null);
          setLoading(false);
          return; // Exit if id is not a string
        }
        // Now 'id' is guaranteed to be a string
        // --- End of FIX ---

        // Mock data for demonstration
        const mockDestinations: Record<MockDestinationKey, DestinationData> = { // Type the mock object
          'havelock-island': {
            id: 'havelock-island',
            name: 'Havelock Island',
            description: 'Home to Radhanagar Beach, one of Asia\'s best beaches with pristine white sands and crystal clear waters.',
            image: '/images/havelock.jpg',
            highlights: ['Radhanagar Beach', 'Elephant Beach', 'Kalapathar Beach'],
            activities: ['Scuba Diving', 'Snorkeling', 'Kayaking'],
            bestTimeToVisit: 'October to May',
            howToReach: 'Ferry from Port Blair (Approx. 1.5 - 2 hours)'
          },
          'neil-island': {
            id: 'neil-island',
            name: 'Neil Island',
            description: 'Known for its pristine beaches and natural bridge formation, perfect for a relaxing getaway.',
            image: '/images/neil.jpg',
            highlights: ['Natural Bridge', 'Bharatpur Beach', 'Laxmanpur Beach'],
            activities: ['Snorkeling', 'Glass Bottom Boat Ride', 'Cycling'],
            bestTimeToVisit: 'October to May',
            howToReach: 'Ferry from Port Blair (Approx. 1.5 hours) or Havelock (Approx. 1 hour)'
          },
          'port-blair': {
            id: 'port-blair',
            name: 'Port Blair',
            description: 'The capital city with historical Cellular Jail, museums, and Corbyn\'s Cove beach.',
            image: '/images/port_blair.jpg',
            highlights: ['Cellular Jail', 'Ross Island', 'Corbyn\'s Cove Beach', 'Samudrika Museum'],
            activities: ['Historical Tours', 'Museum Visits', 'Shopping', 'Water Sports at North Bay'],
            bestTimeToVisit: 'October to May',
            howToReach: 'Direct flights from major Indian cities'
          },
          'baratang-island': {
            id: 'baratang-island',
            name: 'Baratang Island',
            description: 'Famous for its unique limestone caves, dense mangrove creeks, and mud volcanoes.',
            image: '/images/baratang.jpg',
            highlights: ['Limestone Caves', 'Mud Volcanoes', 'Mangrove Creeks', 'Parrot Island'],
            activities: ['Cave Exploration', 'Boat Rides through Mangroves', 'Bird Watching'],
            bestTimeToVisit: 'November to April (avoiding heavy monsoon)',
            howToReach: 'Road trip from Port Blair (Approx. 3 hours) involving vehicle ferry'
          }
        };

        // --- FIX: Use the validated string 'id' as key ---
        // Check if the validated 'id' is a valid key in our typed mock object
        if (id in mockDestinations) {
            // Assert the type of the key for indexing
            const destinationData = mockDestinations[id as MockDestinationKey];
            setDestination(destinationData);
        } else {
          console.log(`Mock destination not found for id: ${id}`);
          setError(`Destination "${id}" not found.`);
          setDestination(null);
        }
        // --- End of FIX ---

      } catch (error) {
        // This catch block might not be strictly necessary for mock data
        // but good practice if API calls were involved
        console.error('Error processing destination data:', error);
        setError('An unexpected error occurred.');
        setDestination(null);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    if (params.id) { // Only run if params.id is initially available
      fetchDestination();
    } else {
      // Handle the case where params are not ready on initial render
      // We could keep loading, or show an error if it persists
      // For now, let's assume params become available quickly
       setLoading(false); // Or keep true until params.id is defined
       // setDestination(null); // Already default
       // setError("Destination ID not found in URL.");
    }
  }, [params.id]); // Rerun effect if params.id changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading destination...</span>
      </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link href="/destinations" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
             Back to Destinations
            </Link>
        </div>
     );
  }


  if (!destination) {
    // This case might be covered by the error state if ID was invalid/not found
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Destination Not Found</h2>
            <p className="text-gray-600 mb-6">The destination you are looking for does not exist.</p>
             <Link href="/destinations" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
             Back to Destinations
            </Link>
        </div>
    );
  }

  // --- JSX remains largely the same, uses fetched 'destination' state ---
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[50vh] w-full">
        <Image
          src={destination.image || '/images/placeholder.jpg'} // Use placeholder if image missing
          alt={destination.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">{destination.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
          <p className="text-gray-700 mb-6 whitespace-pre-line">{destination.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div>
                 <h3 className="text-xl font-semibold mb-2">Highlights</h3>
                 <ul className="list-disc pl-5 space-y-1">
                   {destination.highlights.map((highlight, index) => (
                     <li key={index} className="text-gray-700">{highlight}</li>
                   ))}
                 </ul>
             </div>
              <div>
                 <h3 className="text-xl font-semibold mb-2">Popular Activities</h3>
                 <ul className="list-disc pl-5 space-y-1">
                   {destination.activities.map((activity, index) => (
                     <li key={index} className="text-gray-700">{activity}</li>
                   ))}
                 </ul>
              </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Best Time to Visit</h3>
              <p className="text-gray-700">{destination.bestTimeToVisit}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How to Reach</h3>
              <p className="text-gray-700">{destination.howToReach}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Packages Including {destination.name}</h2>
          <p className="text-gray-700 mb-4">Explore our curated packages that include visits to {destination.name}.</p>
          {/* This would be a list of packages in a real implementation */}
          <div className="mt-4">
            <Link href="/packages" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
              View All Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}