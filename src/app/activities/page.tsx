'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  image_url: string;
  destination_name: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch('/api/activities');
        const data = await response.json();
        
        if (data.success) {
          setActivities(data.data || []);
        } else {
          console.error('Failed to fetch activities:', data.message);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // Sample activities for development (since API returns empty array)
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

  // Use sample data if API returns empty array
  const displayActivities = activities.length > 0 ? activities : sampleActivities;

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
        ) : (
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
                    href={`/activities/${activity.id}`}
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Book Now
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
