

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
export const runtime = 'edge';
export default function DestinationDetail() {
  const params = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For now, we'll use mock data based on the ID
    const fetchDestination = async () => {
      try {
        // This would be an API call in a real implementation
        // const response = await fetch(`/api/destinations/${params.id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockDestinations = {
          'havelock-island': {
            id: 'havelock-island',
            name: 'Havelock Island',
            description: 'Home to Radhanagar Beach, one of Asia\'s best beaches with pristine white sands and crystal clear waters.',
            image: '/images/havelock.jpg',
            highlights: ['Radhanagar Beach', 'Elephant Beach', 'Kalapathar Beach'],
            activities: ['Scuba Diving', 'Snorkeling', 'Kayaking'],
            bestTimeToVisit: 'October to May',
            howToReach: 'Ferry from Port Blair (2 hours)'
          },
          'neil-island': {
            id: 'neil-island',
            name: 'Neil Island',
            description: 'Known for its pristine beaches and natural bridge formation, perfect for a relaxing getaway.',
            image: '/images/neil.jpg',
            highlights: ['Natural Bridge', 'Bharatpur Beach', 'Laxmanpur Beach'],
            activities: ['Snorkeling', 'Glass Bottom Boat Ride', 'Cycling'],
            bestTimeToVisit: 'October to May',
            howToReach: 'Ferry from Port Blair (1.5 hours) or Havelock (1 hour)'
          },
          'port-blair': {
            id: 'port-blair',
            name: 'Port Blair',
            description: 'The capital city with historical Cellular Jail and other colonial remnants.',
            image: '/images/port_blair.jpg',
            highlights: ['Cellular Jail', 'Ross Island', 'Corbyn\'s Cove Beach'],
            activities: ['Historical Tours', 'Museum Visits', 'Shopping'],
            bestTimeToVisit: 'October to May',
            howToReach: 'Direct flights from major Indian cities'
          },
          'baratang-island': {
            id: 'baratang-island',
            name: 'Baratang Island',
            description: 'Famous for limestone caves and mud volcanoes.',
            image: '/images/baratang.jpg',
            highlights: ['Limestone Caves', 'Mud Volcanoes', 'Mangrove Creeks'],
            activities: ['Cave Exploration', 'Boat Rides', 'Nature Walks'],
            bestTimeToVisit: 'November to April',
            howToReach: 'Ferry from Port Blair (3 hours)'
          }
        };
        
        // Get destination based on ID parameter
        const destinationData = mockDestinations[params.id] || null;
        setDestination(destinationData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destination:', error);
        setLoading(false);
      }
    };

    fetchDestination();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!destination) {
    return <div className="min-h-screen flex items-center justify-center">Destination not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[50vh] w-full">
        <Image 
          src={destination.image} 
          alt={destination.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">{destination.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
          <p className="text-gray-700 mb-6">{destination.description}</p>
          
          <h3 className="text-xl font-semibold mb-2">Highlights</h3>
          <ul className="list-disc pl-5 mb-6">
            {destination.highlights.map((highlight, index) => (
              <li key={index} className="text-gray-700 mb-1">{highlight}</li>
            ))}
          </ul>
          
          <h3 className="text-xl font-semibold mb-2">Popular Activities</h3>
          <ul className="list-disc pl-5 mb-6">
            {destination.activities.map((activity, index) => (
              <li key={index} className="text-gray-700 mb-1">{activity}</li>
            ))}
          </ul>
          
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
          <p className="text-gray-700">Explore our curated packages that include visits to {destination.name}.</p>
          
          {/* This would be a list of packages in a real implementation */}
          <div className="mt-4">
            <Link href="/packages" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
              View Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
