'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url: string;
  highlights?: string[];
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations');
        const data = await response.json();
        
        if (data.success) {
          setDestinations(data.data || []);
        } else {
          console.error('Failed to fetch destinations:', data.message);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  // Sample destinations for development (since API returns empty array)
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

  // Use sample data if API returns empty array
  const displayDestinations = destinations.length > 0 ? destinations : sampleDestinations;

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-blue-900 h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700">
          <Image 
            src="/images/destinations-hero.jpg" 
            alt="Andaman Destinations" 
            fill 
            className="object-cover mix-blend-overlay"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Explore Andaman Destinations
          </h1>
          <p className="text-xl text-white text-center max-w-2xl">
            Discover paradise islands with pristine beaches, vibrant coral reefs, and lush forests
          </p>
        </div>
      </div>
      
      {/* Destinations List */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading destinations...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayDestinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="h-56 bg-blue-200 relative">
                  <Image 
                    src={destination.image_url || '/images/placeholder.jpg'} 
                    alt={destination.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{destination.name}</h2>
                  <p className="text-gray-600 mb-4">{destination.location}</p>
                  <p className="text-gray-700 mb-4">{destination.description}</p>
                  
                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Highlights:</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {destination.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Link 
                    href={`/destinations/${destination.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Explore More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
