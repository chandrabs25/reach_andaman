"use client"; // Add this line at the top

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ArrowRight } from 'lucide-react';

export default function DestinationPage() {
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const destinationId = params.id;

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${destinationId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch destination');
        }
        const data = await response.json();
        setDestination(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestination();
  }, [destinationId]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  if (!destination) {
    return <div className="text-center">Destination not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{destination.name}</h1>
      <div className="relative h-96 w-full mb-4">
        <Image
          src={destination.image_url}
          alt={destination.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex items-center mb-4">
        <MapPin className="h-4 w-4 mr-2" />
        <p className="text-gray-600">{destination.location}</p>
      </div>
      <p className="text-gray-700 mb-4">{destination.description}</p>
      <h2 className="text-2xl font-semibold mb-2">Highlights</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        {destination.highlights && destination.highlights.map((highlight, index) => (
          <li key={index}>{highlight}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mb-2">Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {destination.activities && destination.activities.map((activity) => (
          <div key={activity.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{activity.name}</h3>
            <p className="text-gray-600">{activity.description}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-2">Nearby Accommodations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destination.accommodations && destination.accommodations.map((accommodation) => (
          <div key={accommodation.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{accommodation.name}</h3>
            <p className="text-gray-600">{accommodation.type}</p>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <p className="text-gray-600">{accommodation.rating}</p>
            </div>
          </div>
        ))}
      </div>
      <Link href="/destinations" className="mt-4 inline-flex items-center text-blue-500 hover:underline">
        <ArrowRight className="h-4 w-4 mr-1" />
        Back to Destinations
      </Link>
    </div>
  );
}
