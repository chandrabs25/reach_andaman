'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, Users, Check, Info } from 'lucide-react';
export const runtime = 'edge';
export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState(1);
  
  const itinerary = {
    id: 1,
    name: 'Andaman Explorer',
    duration: '5 Days / 4 Nights',
    price: 15999,
    description: 'Explore the best of Andaman with this comprehensive package covering the major islands and attractions.',
    highlights: [
      'Visit the historic Cellular Jail in Port Blair',
      'Experience the pristine Radhanagar Beach in Havelock Island',
      'Explore the natural bridge in Neil Island',
      'Enjoy water activities like snorkeling and scuba diving',
      'Witness the Light and Sound show at Cellular Jail'
    ],
    inclusions: [
      'Accommodation in 3-star hotels',
      'All transfers by AC vehicle',
      'Ferry tickets between islands',
      'Daily breakfast and dinner',
      'All sightseeing as per itinerary',
      'Experienced tour guide'
    ],
    exclusions: [
      'Airfare to and from Port Blair',
      'Lunch and personal expenses',
      'Optional activities not mentioned in itinerary',
      'Travel insurance',
      'Additional expenses during free time'
    ],
    days: [
      {
        day: 1,
        title: 'Arrival in Port Blair',
        description: 'Arrive at Veer Savarkar International Airport in Port Blair. Check-in to your hotel and relax. In the afternoon, visit the historic Cellular Jail and attend the Light and Sound show in the evening.',
        activities: [
          { name: 'Airport pickup', time: '10:00 AM', duration: '30 mins' },
          { name: 'Hotel check-in', time: '12:00 PM', duration: '1 hour' },
          { name: 'Cellular Jail visit', time: '3:00 PM', duration: '2 hours' },
          { name: 'Light and Sound show', time: '6:00 PM', duration: '1 hour' }
        ],
        meals: ['Dinner'],
        accommodation: 'Hotel Sea Shell, Port Blair'
      },
      {
        day: 2,
        title: 'Port Blair to Havelock Island',
        description: 'After breakfast, transfer to Phoenix Bay Jetty to board the ferry to Havelock Island. Check-in to your resort and visit the famous Radhanagar Beach in the afternoon.',
        activities: [
          { name: 'Breakfast at hotel', time: '7:30 AM', duration: '1 hour' },
          { name: 'Transfer to jetty', time: '9:00 AM', duration: '30 mins' },
          { name: 'Ferry to Havelock', time: '10:30 AM', duration: '2 hours' },
          { name: 'Resort check-in', time: '1:00 PM', duration: '1 hour' },
          { name: 'Radhanagar Beach visit', time: '3:30 PM', duration: '3 hours' }
        ],
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Symphony Palms Beach Resort, Havelock'
      },
      {
        day: 3,
        title: 'Havelock Island Activities',
        description: 'Full day for water activities at Elephant Beach. Enjoy snorkeling, sea walking, and other water sports. Return to the resort in the evening.',
        activities: [
          { name: 'Breakfast at resort', time: '8:00 AM', duration: '1 hour' },
          { name: 'Transfer to Elephant Beach', time: '9:30 AM', duration: '45 mins' },
          { name: 'Snorkeling session', time: '10:30 AM', duration: '1 hour' },
          { name: 'Lunch break', time: '12:30 PM', duration: '1 hour' },
          { name: 'Water activities', time: '2:00 PM', duration: '3 hours' },
          { name: 'Return to resort', time: '5:30 PM', duration: '45 mins' }
        ],
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Symphony Palms Beach Resort, Havelock'
      },
      {
        day: 4,
        title: 'Havelock to Neil Island',
        description: 'After breakfast, check-out from the resort and board the ferry to Neil Island. Visit Bharatpur Beach, Natural Bridge, and Laxmanpur Beach.',
        activities: [
          { name: 'Breakfast at resort', time: '7:30 AM', duration: '1 hour' },
          { name: 'Resort check-out', time: '9:00 AM', duration: '30 mins' },
          { name: 'Ferry to Neil Island', time: '10:30 AM', duration: '1 hour' },
          { name: 'Hotel check-in', time: '12:00 PM', duration: '1 hour' },
          { name: 'Bharatpur Beach visit', time: '2:00 PM', duration: '1.5 hours' },
          { name: 'Natural Bridge visit', time: '4:00 PM', duration: '1 hour' },
          { name: 'Laxmanpur Beach sunset', time: '5:30 PM', duration: '1.5 hours' }
        ],
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Summer Sand Beach Resort, Neil Island'
      },
      {
        day: 5,
        title: 'Neil Island to Port Blair - Departure',
        description: 'After breakfast, check-out from the hotel and board the ferry back to Port Blair. Visit local markets for souvenir shopping before transfer to the airport for your departure flight.',
        activities: [
          { name: 'Breakfast at hotel', time: '7:30 AM', duration: '1 hour' },
          { name: 'Hotel check-out', time: '9:00 AM', duration: '30 mins' },
          { name: 'Ferry to Port Blair', time: '10:30 AM', duration: '1.5 hours' },
          { name: 'Souvenir shopping', time: '12:30 PM', duration: '2 hours' },
          { name: 'Transfer to airport', time: '3:00 PM', duration: '30 mins' }
        ],
        meals: ['Breakfast'],
        accommodation: 'N/A'
      }
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">{itinerary.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Clock size={18} className="mr-1" />
                <span>{itinerary.duration}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={18} className="mr-1" />
                <span>Port Blair, Havelock, Neil Island</span>
              </div>
              <div className="flex items-center">
                <Users size={18} className="mr-1" />
                <span>Max 15 people</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 mb-6">{itinerary.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Price</h3>
                <p className="text-2xl font-bold">₹{itinerary.price.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500">per person</p>
                <Link 
                  href={`/packages/${itinerary.id}/book`}
                  className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition duration-300"
                >
                  Book Now
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Highlights</h3>
                <ul className="space-y-2">
                  {itinerary.highlights.slice(0, 4).map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                  {itinerary.highlights.length > 4 && (
                    <li className="text-sm text-blue-600">+ {itinerary.highlights.length - 4} more highlights</li>
                  )}
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Inclusions</h3>
                <ul className="space-y-2">
                  {itinerary.inclusions.slice(0, 4).map((inclusion, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-sm">{inclusion}</span>
                    </li>
                  ))}
                  {itinerary.inclusions.length > 4 && (
                    <li className="text-sm text-blue-600">+ {itinerary.inclusions.length - 4} more inclusions</li>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Day Selector */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              <div className="flex overflow-x-auto pb-2 space-x-2">
                {itinerary.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                      selectedDay === day.day
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Day {day.day}: {day.title}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Selected Day Details */}
            {itinerary.days.map((day) => (
              <div key={day.day} className={selectedDay === day.day ? 'block' : 'hidden'}>
                <div className="border-l-4 border-blue-600 pl-4 mb-6">
                  <h3 className="text-xl font-semibold">Day {day.day}: {day.title}</h3>
                  <p className="text-gray-600 mt-2">{day.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Activities</h4>
                    <div className="space-y-3">
                      {day.activities.map((activity, index) => (
                        <div key={index} className="flex">
                          <div className="w-20 flex-shrink-0 text-sm text-gray-500">{activity.time}</div>
                          <div>
                            <div className="text-sm font-medium">{activity.name}</div>
                            <div className="text-xs text-gray-500">{activity.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Meals</h4>
                    <div className="space-y-1">
                      {day.meals.length > 0 ? (
                        day.meals.map((meal, index) => (
                          <div key={index} className="flex items-center">
                            <Check size={16} className="mr-2 text-green-500" />
                            <span className="text-sm">{meal}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No meals included</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Accommodation</h4>
                    <div className="text-sm">
                      {day.accommodation !== 'N/A' ? (
                        <div className="flex items-start">
                          <MapPin size={16} className="mr-2 text-gray-500 flex-shrink-0 mt-1" />
                          <span>{day.accommodation}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">No accommodation (departure day)</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {day.day < itinerary.days.length && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedDay(day.day + 1)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      Next Day <span className="ml-1">→</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Important Information</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Exclusions</h3>
              <ul className="space-y-2">
                {itinerary.exclusions.map((exclusion, index) => (
                  <li key={index} className="flex items-start">
                    <Info size={16} className="mr-2 text-red-500 flex-shrink-0 mt-1" />
                    <span className="text-sm">{exclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Cancellation Policy</h3>
              <ul className="space-y-2 text-sm">
                <li>Free cancellation up to 7 days before the start date</li>
                <li>50% refund for cancellations between 3-7 days before start date</li>
                <li>No refund for cancellations less than 3 days before start date</li>
                <li>All refunds will be processed within 7 working days</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
              <ul className="space-y-2 text-sm">
                <li>Itinerary is subject to change based on weather conditions</li>
                <li>Ferry timings may vary; final schedule will be provided upon booking</li>
                <li>Carry valid ID proof for ferry and hotel check-ins</li>
                <li>Children below 5 years can join free of charge (without extra bed)</li>
                <li>Special dietary requirements should be informed at the time of booking</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Booking CTA */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore Andaman?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Book this package now to secure your spot. Limited availability during peak season.
          </p>
          <Link 
            href={`/packages/${itinerary.id}/book`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition duration-300"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
