'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Clock, Users, Phone, Mail, Globe } from 'lucide-react';

export default function VendorListings() {
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    rating: '',
    priceRange: ''
  });

  // Mock vendor data
  const vendors = [
    {
      id: 1,
      name: 'Island Adventures',
      type: 'Activity Provider',
      location: 'Port Blair',
      rating: 4.8,
      reviewCount: 124,
      description: 'Offering a wide range of water activities including scuba diving, snorkeling, and sea walking experiences.',
      services: ['Scuba Diving', 'Snorkeling', 'Sea Walking', 'Glass Bottom Boat'],
      priceRange: '₹1,200 - ₹3,500',
      image: '/images/vendors/island-adventures.jpg',
      verified: true
    },
    {
      id: 2,
      name: 'Barefoot Resorts',
      type: 'Accommodation',
      location: 'Havelock Island',
      rating: 4.9,
      reviewCount: 256,
      description: 'Luxury eco-friendly resort located on the pristine Radhanagar Beach with stunning ocean views and world-class amenities.',
      services: ['Beachfront Villas', 'Restaurant', 'Spa', 'Water Sports'],
      priceRange: '₹12,000 - ₹25,000',
      image: '/images/vendors/barefoot-resorts.jpg',
      verified: true
    },
    {
      id: 3,
      name: 'Andaman Ferries',
      type: 'Transportation',
      location: 'Port Blair',
      rating: 4.6,
      reviewCount: 189,
      description: 'Reliable ferry service connecting Port Blair, Havelock, and Neil Island with comfortable seating and on-time departures.',
      services: ['Ferry Transport', 'Private Charters', 'Island Hopping'],
      priceRange: '₹800 - ₹1,500',
      image: '/images/vendors/andaman-ferries.jpg',
      verified: true
    },
    {
      id: 4,
      name: 'Coral Safari',
      type: 'Activity Provider',
      location: 'Havelock Island',
      rating: 4.7,
      reviewCount: 112,
      description: 'Specialized in scuba diving and underwater photography with experienced instructors and top-quality equipment.',
      services: ['Scuba Diving', 'Underwater Photography', 'PADI Certification'],
      priceRange: '₹3,500 - ₹15,000',
      image: '/images/vendors/coral-safari.jpg',
      verified: true
    },
    {
      id: 5,
      name: 'Neil Island Retreats',
      type: 'Accommodation',
      location: 'Neil Island',
      rating: 4.5,
      reviewCount: 87,
      description: 'Peaceful cottages surrounded by tropical gardens, just a short walk from Bharatpur Beach.',
      services: ['Garden Cottages', 'Restaurant', 'Bicycle Rental', 'Tour Desk'],
      priceRange: '₹4,500 - ₹8,000',
      image: '/images/vendors/neil-island-retreats.jpg',
      verified: false
    },
    {
      id: 6,
      name: 'Andaman Explorers',
      type: 'Tour Operator',
      location: 'Port Blair',
      rating: 4.8,
      reviewCount: 203,
      description: 'Comprehensive tour packages covering all major attractions in the Andaman Islands with knowledgeable local guides.',
      services: ['Guided Tours', 'Custom Itineraries', 'Group Packages', 'Private Tours'],
      priceRange: '₹2,500 - ₹20,000',
      image: '/images/vendors/andaman-explorers.jpg',
      verified: true
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredVendors = vendors.filter(vendor => {
    if (filters.type && vendor.type !== filters.type) return false;
    if (filters.location && vendor.location !== filters.location) return false;
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      if (vendor.rating < minRating) return false;
    }
    if (filters.priceRange) {
      // This is a simplified price range filter
      // In a real application, you would parse the price range and compare properly
      if (filters.priceRange === 'budget' && !vendor.priceRange.includes('1,')) return false;
      if (filters.priceRange === 'mid' && !vendor.priceRange.includes('5,')) return false;
      if (filters.priceRange === 'luxury' && !vendor.priceRange.includes('10,')) return false;
    }
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Service Providers</h1>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Discover our verified service providers offering accommodations, activities, transportation, and tour services across the Andaman Islands.
        </p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Provider Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Activity Provider">Activity Provider</option>
                <option value="Transportation">Transportation</option>
                <option value="Tour Operator">Tour Operator</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Locations</option>
                <option value="Port Blair">Port Blair</option>
                <option value="Havelock Island">Havelock Island</option>
                <option value="Neil Island">Neil Island</option>
              </select>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Price</option>
                <option value="budget">Budget</option>
                <option value="mid">Mid-Range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vendor Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.length > 0 ? (
            filteredVendors.map(vendor => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
                <div className="h-48 bg-blue-200 relative">
                  {/* Placeholder for vendor image */}
                  {/* <Image src={vendor.image} alt={vendor.name} fill className="object-cover" /> */}
                  {vendor.verified && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{vendor.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                      <span className="ml-1 text-xs text-gray-500">({vendor.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{vendor.location}</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {vendor.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{vendor.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                    {vendor.services.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        +{vendor.services.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Price Range: <span className="font-semibold">{vendor.priceRange}</span>
                    </span>
                    <Link 
                      href={`/vendors/${vendor.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No service providers found</h3>
              <p className="text-gray-600">Try adjusting your filters to find available service providers.</p>
            </div>
          )}
        </div>

        {/* Become a Vendor CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Are You a Service Provider?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our platform to reach thousands of travelers planning their trip to the Andaman Islands. List your services, manage bookings, and grow your business.
          </p>
          <Link 
            href="/vendor/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-300"
          >
            Register as Vendor
          </Link>
        </div>
      </div>
    </div>
  );
}
