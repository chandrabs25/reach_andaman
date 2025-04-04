"use client"; // Add this line at the top

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, Star, Clock, ArrowRight } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        setPackages(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Our Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{pkg.name}</h2>
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <p className="text-gray-600">{pkg.destinations}</p>
            </div>
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <p className="text-gray-600">{pkg.duration_days} Days / {pkg.duration_nights} Nights</p>
            </div>
            <div className="flex items-center mb-2">
              <Users className="h-4 w-4 mr-2" />
              <p className="text-gray-600">₹{pkg.price} per person</p>
            </div>
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-2" />
              <p className="text-gray-600">Activities: {pkg.activities}</p>
            </div>
            <Link href={`/packages/${pkg.id}`} className="mt-4 inline-flex items-center text-blue-500 hover:underline">
              <ArrowRight className="h-4 w-4 mr-1" />
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
