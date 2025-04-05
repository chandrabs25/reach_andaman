// Path: .\src\app\packages\page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import React
import Link from 'next/link';
import { MapPin, Calendar, Clock, Users, Star, ArrowRight } from 'lucide-react'; // Assuming Calendar/Users might be used later, added Clock

// --- Define Interfaces ---
interface Package {
  id: number;
  name: string;
  image: string;
  duration: string;
  destinations: string[];
  price: number;
  rating: number;
  activities: string[];
  description: string;
}

interface FiltersState {
  destination: string;
  duration: string;
  priceRange: string;
  activities: string[]; // Explicitly type as string array
}
// --- End Interfaces ---


export default function Packages() {
  // --- Explicitly type the state ---
  const [filters, setFilters] = useState<FiltersState>({
    destination: '',
    duration: '',
    priceRange: '',
    activities: [] // Initialized correctly as string[] now
  });
  // --- End State Typing ---

  // --- Mock Data (Typed) ---
  const initialPackagesData: Package[] = [ // Use the Package type
    {
      id: 1,
      name: 'Andaman Explorer',
      image: '/images/packages/andaman-explorer.jpg', // Use placeholder paths if images don't exist yet
      duration: '5 Days / 4 Nights',
      destinations: ['Port Blair', 'Havelock Island', 'Neil Island'],
      price: 15999,
      rating: 4.8,
      activities: ['Scuba Diving', 'Island Hopping', 'Beach Activities', 'Sightseeing'],
      description: 'Explore the best of Andaman with this comprehensive package covering the major islands and attractions.'
    },
    {
      id: 2,
      name: 'Honeymoon Special',
      image: '/images/packages/honeymoon-special.jpg',
      duration: '6 Days / 5 Nights',
      destinations: ['Port Blair', 'Havelock Island', 'Neil Island'],
      price: 24999,
      rating: 4.9,
      activities: ['Candlelight Dinner', 'Couple Spa', 'Private Beach Tour', 'Snorkeling'],
      description: 'A romantic getaway designed specifically for couples with private experiences and luxury accommodations.'
    },
    {
      id: 3,
      name: 'Adventure Seeker',
      image: '/images/packages/adventure-seeker.jpg',
      duration: '7 Days / 6 Nights',
      destinations: ['Port Blair', 'Havelock Island', 'Baratang', 'North Bay'],
      price: 19999,
      rating: 4.7,
      activities: ['Scuba Diving', 'Trekking', 'Kayaking', 'Snorkeling', 'Jet Skiing'],
      description: 'For the thrill-seekers, this package includes all the adventure activities Andaman has to offer.'
    },
    {
      id: 4,
      name: 'Budget Friendly',
      image: '/images/packages/budget-friendly.jpg',
      duration: '4 Days / 3 Nights',
      destinations: ['Port Blair', 'Havelock Island'],
      price: 12999,
      rating: 4.5,
      activities: ['Sightseeing', 'Beach Activities', 'Cellular Jail Visit'],
      description: 'Experience the beauty of Andaman without breaking the bank with this value-for-money package.'
    },
    {
      id: 5,
      name: 'Family Vacation',
      image: '/images/packages/family-vacation.jpg',
      duration: '6 Days / 5 Nights',
      destinations: ['Port Blair', 'Havelock Island', 'Neil Island', 'Ross Island'],
      price: 18999,
      rating: 4.6,
      activities: ['Glass Bottom Boat', 'Light & Sound Show', 'Beach Activities', 'Museum Visit'],
      description: 'A family-friendly package with activities suitable for all age groups and comfortable accommodations.'
    },
    {
      id: 6,
      name: 'Island Explorer Plus',
      image: '/images/packages/island-explorer-plus.jpg',
      duration: '8 Days / 7 Nights',
      destinations: ['Port Blair', 'Havelock Island', 'Neil Island', 'Baratang', 'Diglipur'],
      price: 27999,
      rating: 4.8,
      activities: ['Scuba Diving', 'Trekking', 'Limestone Caves', 'Mud Volcano', 'Turtle Nesting Watch'],
      description: 'The most comprehensive package covering both popular and off-beat destinations in the Andaman Islands.'
    }
  ];
  // --- End Mock Data ---

  const [packages, setPackages] = useState<Package[]>(initialPackagesData); // Type package state
  const [filteredPackages, setFilteredPackages] = useState<Package[]>(packages); // Type filtered state

  // --- FIX: Add type to event parameter 'e' ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  // --- End FIX ---
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // --- FIX: Add type to parameter 'activity' ---
  const handleActivityToggle = (activity: string) => {
  // --- End FIX ---
    // Type annotation for updater function prevents errors
    setFilters((prev: FiltersState): FiltersState => {
      const currentActivities = [...prev.activities]; // Now correctly string[]
      if (currentActivities.includes(activity)) {
        return {
          ...prev,
          activities: currentActivities.filter(a => a !== activity)
        };
      } else {
        return {
          ...prev,
          activities: [...currentActivities, activity] // TS knows this is string[]
        };
      }
    });
  };

  // No type errors expected here now that filters state is typed
  const applyFilters = () => {
    let tempFiltered = [...packages]; // Start with all packages

    if (filters.destination) {
      tempFiltered = tempFiltered.filter(pkg =>
        pkg.destinations.some(dest =>
          dest.toLowerCase().includes(filters.destination.toLowerCase())
        )
      );
    }

    if (filters.duration) {
      // Assuming duration filter value is number of days as string '4', '5', '8+' etc.
      const durationDays = parseInt(filters.duration);
      if (!isNaN(durationDays)) {
          tempFiltered = tempFiltered.filter(pkg => {
              const pkgDaysMatch = pkg.duration.match(/^(\d+)\s*Days/i);
              const pkgDays = pkgDaysMatch ? parseInt(pkgDaysMatch[1]) : 0;
              if (filters.duration.includes('+')) { // Handle '8+' case
                 return pkgDays >= durationDays;
              }
              return pkgDays === durationDays;
          });
      }
    }

    if (filters.priceRange) {
      const range = filters.priceRange.split('-').map(Number);
      const min = range[0];
      const max = range.length > 1 ? range[1] : Infinity; // Handle single value like '30000+'

      if (!isNaN(min)) {
          tempFiltered = tempFiltered.filter(pkg => pkg.price >= min && pkg.price <= max);
      }
    }

    if (filters.activities.length > 0) {
      tempFiltered = tempFiltered.filter(pkg =>
        filters.activities.every(filterActivity => // Use 'every' if user wants ALL selected activities
          pkg.activities.some(pkgActivity => // Use 'some' if user wants ANY selected activity
             pkgActivity.toLowerCase().includes(filterActivity.toLowerCase())
          )
        )
        // Original logic (ANY match):
        // filters.activities.some(activity =>
        //   pkg.activities.some(pkgActivity =>
        //       pkgActivity.toLowerCase().includes(activity.toLowerCase())
        //   )
        // )
      );
    }

    setFilteredPackages(tempFiltered);
  };


  useEffect(() => {
    applyFilters();
  }, [filters, packages]); // Include packages if it can change


  // --- JSX ---
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Travel Packages</h1>
        {/* ... Description ... */}
         <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"> Discover our carefully curated travel packages designed to give you the best Andaman experience. From adventure seekers to honeymooners, we have something for everyone. </p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1"> Destination </label>
              <div className="relative"> <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /> <select id="destination" name="destination" value={filters.destination} onChange={handleFilterChange} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"> <option value="">All Destinations</option> <option value="Port Blair">Port Blair</option> <option value="Havelock">Havelock Island</option> <option value="Neil">Neil Island</option> <option value="Baratang">Baratang Island</option> <option value="Diglipur">Diglipur</option> </select> </div>
            </div>
            {/* Duration */}
             <div>
               <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1"> Duration </label>
               <div className="relative"> <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /> <select id="duration" name="duration" value={filters.duration} onChange={handleFilterChange} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"> <option value="">Any Duration</option> <option value="4">4 Days</option> <option value="5">5 Days</option> <option value="6">6 Days</option> <option value="7">7 Days</option> <option value="8+">8+ Days</option> </select> </div>
             </div>
            {/* Price Range */}
             <div>
               <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1"> Price Range </label>
               <select id="priceRange" name="priceRange" value={filters.priceRange} onChange={handleFilterChange} className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"> <option value="">Any Price</option> <option value="10000-15000">₹10,000 - ₹15,000</option> <option value="15000-20000">₹15,000 - ₹20,000</option> <option value="20000-25000">₹20,000 - ₹25,000</option> <option value="25000-30000">₹25,000 - ₹30,000</option> <option value="30000">₹30,000+</option> </select>
             </div>
            {/* Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> Popular Activities </label>
              <div className="flex flex-wrap gap-2">
                 {/* Use includes on filters.activities (now string[]) */}
                 {['Scuba Diving', 'Snorkeling', 'Trekking', 'Beach Activities'].map(activity => (
                   <button
                     key={activity}
                     onClick={() => handleActivityToggle(activity)}
                     className={`text-xs px-2 py-1 rounded-full ${
                       filters.activities.includes(activity) // No error here now
                         ? 'bg-blue-600 text-white'
                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                     }`}
                   >
                     {activity}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Package Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => (
               <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
                  {/* ... Package card content ... */}
                    <div className="h-48 bg-blue-200 relative"> {/* Placeholder */} <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-blue-600"> ₹{pkg.price.toLocaleString('en-IN')} </div> </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2"> <h3 className="text-xl font-semibold">{pkg.name}</h3> <div className="flex items-center text-yellow-500"> <Star size={16} fill="currentColor" /> <span className="ml-1 text-sm font-medium">{pkg.rating}</span> </div> </div>
                      <div className="flex items-center text-gray-600 mb-3"> <Clock size={16} className="mr-1" /> <span className="text-sm">{pkg.duration}</span> </div>
                      <div className="flex items-start mb-4"> <MapPin size={16} className="mr-1 mt-1 flex-shrink-0 text-gray-600" /> <span className="text-sm text-gray-600">{pkg.destinations.join(' • ')}</span> </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p> {/* Use line-clamp */}
                      <div className="flex flex-wrap gap-2 mb-4"> {pkg.activities.slice(0, 3).map((activity, index) => ( <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"> {activity} </span> ))} {pkg.activities.length > 3 && ( <span className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-full"> +{pkg.activities.length - 3} more </span> )} </div>
                      <div className="flex justify-between items-center"> <span className="text-gray-600 text-sm"> Starting from <span className="font-semibold text-blue-600">₹{pkg.price.toLocaleString('en-IN')}</span> </span> <Link href={`/packages/${pkg.id}`} className="flex items-center text-blue-600 hover:text-blue-800 font-medium"> View Details <ArrowRight size={16} className="ml-1" /> </Link> </div>
                    </div>
               </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No packages found</h3>
              <p className="text-gray-600">Try adjusting your filters to find available packages.</p>
            </div>
          )}
        </div>

        {/* Custom Package CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
           <p className="text-gray-600 mb-6 max-w-2xl mx-auto"> Let us create a custom package tailored to your preferences, budget, and travel dates. </p>
          <Link
            href="/custom-package" // Ensure this route exists
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-300"
          >
            Create Custom Package
          </Link>
        </div>
      </div>
    </div>
  );
}