'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState('');

  const featuredDestinations = [
    {
      id: 1,
      name: 'Havelock Island',
      image: '/images/havelock.jpg',
      description: 'Home to Radhanagar Beach, one of Asia\'s best beaches',
    },
    {
      id: 2,
      name: 'Neil Island',
      image: '/images/neil.jpg',
      description: 'Known for its pristine beaches and natural bridge',
    },
    {
      id: 3,
      name: 'Port Blair',
      image: '/images/port-blair.jpg',
      description: 'The capital city with historical Cellular Jail',
    },
    {
      id: 4,
      name: 'Baratang Island',
      image: '/images/baratang.jpg',
      description: 'Famous for limestone caves and mud volcanoes',
    },
  ];

  const popularActivities = [
    {
      id: 1,
      name: 'Scuba Diving',
      image: '/images/scuba.jpg',
      description: 'Explore vibrant coral reefs and marine life',
    },
    {
      id: 2,
      name: 'Sea Walking',
      image: '/images/sea-walking.jpg',
      description: 'Walk on the ocean floor with specialized equipment',
    },
    {
      id: 3,
      name: 'Kayaking',
      image: '/images/kayaking.jpg',
      description: 'Paddle through mangroves and bioluminescent waters',
    },
    {
      id: 4,
      name: 'Island Hopping',
      image: '/images/island-hopping.jpg',
      description: 'Explore multiple islands in a single trip',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build query parameters for search
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (destination) params.append('destination', destination);
    if (dates) params.append('dates', dates);
    if (travelers) params.append('travelers', travelers);
    
    // Redirect to search-results page with query parameters
    window.location.href = `/search-results?${params.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
        
        {/* Placeholder for hero image - in production, use a real image */}
        <div className="absolute inset-0 bg-blue-900 z-0">
          {/* <Image 
            src="/images/hero.jpg" 
            alt="Andaman Islands" 
            fill 
            className="object-cover"
          /> */}
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6">
            Discover Paradise in Andaman
          </h1>
          <p className="text-xl text-white text-center mb-8 max-w-2xl">
            Explore pristine beaches, vibrant coral reefs, and unforgettable experiences in the Andaman Islands
          </p>
          
          {/* Search Form */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select destination</option>
                      <option value="havelock">Havelock Island</option>
                      <option value="neil">Neil Island</option>
                      <option value="port-blair">Port Blair</option>
                      <option value="baratang">Baratang Island</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="dates" className="block text-sm font-medium text-gray-700 mb-1">
                    Dates
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      id="dates"
                      placeholder="When are you going?"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      id="travelers"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Number of travelers</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5+">5+ People</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    &nbsp;
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Destinations</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDestinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="h-48 bg-blue-200 relative">
                  {/* Placeholder for destination image */}
                  {/* <Image 
                    src={destination.image} 
                    alt={destination.name} 
                    fill 
                    className="object-cover"
                  /> */}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <Link 
                    href={`/destinations/${destination.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Explore More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/destinations"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-300"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Activities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Activities</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="h-48 bg-green-200 relative">
                  {/* Placeholder for activity image */}
                  {/* <Image 
                    src={activity.image} 
                    alt={activity.name} 
                    fill 
                    className="object-cover"
                  /> */}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <Link 
                    href={`/activities/${activity.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/activities"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-300"
            >
              Explore All Activities
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Local Knowledge</h3>
              <p className="text-gray-600">Our team has extensive knowledge of the Andaman Islands, ensuring you get the most authentic experience.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">We offer competitive pricing and transparent booking with no hidden fees or charges.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Customer Support</h3>
              <p className="text-gray-600">Our dedicated support team is available round the clock to assist you with any queries or concerns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Andaman?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your dream vacation today and create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/packages"
              className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 rounded-md font-semibold transition duration-300"
            >
              Browse Packages
            </Link>
            <Link 
              href="/contact"
              className="bg-transparent hover:bg-blue-700 border-2 border-white py-3 px-6 rounded-md font-semibold transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
