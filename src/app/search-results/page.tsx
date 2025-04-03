'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Define types for search results
interface SearchResult {
  id: string | number;
  name: string;
  description: string;
  image_url: string;
  price?: number;
  location?: string;
  duration?: string;
  category: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const destination = searchParams.get('destination') || '';
  const dates = searchParams.get('dates') || '';
  const travelers = searchParams.get('travelers') || '';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    destinations: SearchResult[];
    packages: SearchResult[];
    activities: SearchResult[];
  }>({
    destinations: [],
    packages: [],
    activities: []
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Call the search API with all parameters
        const response = await fetch(`/api/search?q=${query}&destination=${destination}&dates=${dates}&travelers=${travelers}`);
        const data = await response.json();
        
        // If API returns empty results, use sample data
        if (data && 
            (!data.destinations || data.destinations.length === 0) && 
            (!data.packages || data.packages.length === 0) && 
            (!data.activities || data.activities.length === 0)) {
          // Sample data for demonstration
          setResults({
            destinations: [
              {
                id: 'havelock-island',
                name: 'Havelock Island',
                description: 'Home to Radhanagar Beach, one of Asia\'s best beaches with pristine white sands.',
                image_url: '/images/havelock.jpg',
                location: 'Andaman Islands',
                category: 'destination'
              },
              {
                id: 'neil-island',
                name: 'Neil Island',
                description: 'Known for its pristine beaches and natural bridge formation.',
                image_url: '/images/neil.jpg',
                location: 'Andaman Islands',
                category: 'destination'
              }
            ],
            packages: [
              {
                id: 101,
                name: 'Andaman Island Explorer',
                description: '7-day comprehensive tour of the major Andaman Islands.',
                image_url: '/images/placeholder.jpg',
                price: 35000,
                duration: '7 days / 6 nights',
                category: 'package'
              },
              {
                id: 102,
                name: 'Havelock Beach Retreat',
                description: 'Relaxing 4-day beach vacation on Havelock Island.',
                image_url: '/images/placeholder.jpg',
                price: 22000,
                duration: '4 days / 3 nights',
                category: 'package'
              }
            ],
            activities: [
              {
                id: 201,
                name: 'Scuba Diving Experience',
                description: 'Explore vibrant coral reefs and marine life with certified instructors.',
                image_url: '/images/scuba.jpg',
                price: 4500,
                duration: '3 hours',
                category: 'activity'
              },
              {
                id: 202,
                name: 'Glass Bottom Boat Tour',
                description: 'View the underwater world without getting wet.',
                image_url: '/images/placeholder.jpg',
                price: 1800,
                duration: '2 hours',
                category: 'activity'
              }
            ]
          });
        } else {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        // Use sample data on error
        setResults({
          destinations: [
            {
              id: 'havelock-island',
              name: 'Havelock Island',
              description: 'Home to Radhanagar Beach, one of Asia\'s best beaches with pristine white sands.',
              image_url: '/images/havelock.jpg',
              location: 'Andaman Islands',
              category: 'destination'
            }
          ],
          packages: [
            {
              id: 101,
              name: 'Andaman Island Explorer',
              description: '7-day comprehensive tour of the major Andaman Islands.',
              image_url: '/images/placeholder.jpg',
              price: 35000,
              duration: '7 days / 6 nights',
              category: 'package'
            }
          ],
          activities: [
            {
              id: 201,
              name: 'Scuba Diving Experience',
              description: 'Explore vibrant coral reefs and marine life with certified instructors.',
              image_url: '/images/scuba.jpg',
              price: 4500,
              duration: '3 hours',
              category: 'activity'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
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
          {query && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">"{query}"</span>}
          {destination && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Destination: {destination}</span>}
          {dates && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Dates: {dates}</span>}
          {travelers && <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Travelers: {travelers}</span>}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Searching...</span>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No results found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or explore our popular destinations below.</p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Destinations Section */}
          {results.destinations.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Destinations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.destinations.map((destination) => (
                  <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 relative">
                      <Image 
                        src={destination.image_url || '/images/placeholder.jpg'} 
                        alt={destination.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                      <p className="text-gray-600 mb-2">{destination.location}</p>
                      <p className="text-gray-700 mb-4">{destination.description}</p>
                      <Link 
                        href={`/destinations/${destination.id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Explore
                      </Link>
                    </div>
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
                {results.packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 relative">
                      <Image 
                        src={pkg.image_url || '/images/placeholder.jpg'} 
                        alt={pkg.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 mb-2">{pkg.duration}</p>
                      <p className="text-gray-700 mb-3">{pkg.description}</p>
                      <p className="text-lg font-bold text-blue-600 mb-4">₹{pkg.price?.toLocaleString()}</p>
                      <Link 
                        href={`/packages/${pkg.id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
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
                {results.activities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 relative">
                      <Image 
                        src={activity.image_url || '/images/placeholder.jpg'} 
                        alt={activity.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
                      <p className="text-gray-600 mb-2">{activity.duration}</p>
                      <p className="text-gray-700 mb-3">{activity.description}</p>
                      <p className="text-lg font-bold text-blue-600 mb-4">₹{activity.price?.toLocaleString()}</p>
                      <Link 
                        href={`/activities/${activity.id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
