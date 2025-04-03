'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, CreditCard, User, Star, Package, Bell } from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Mock user data
  const userData = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    joinDate: 'January 2025',
    bookings: [
      {
        id: 101,
        package: 'Andaman Explorer',
        startDate: '2025-05-15',
        endDate: '2025-05-19',
        people: 2,
        amount: 31998,
        status: 'confirmed'
      },
      {
        id: 102,
        package: 'Honeymoon Special',
        startDate: '2025-06-10',
        endDate: '2025-06-15',
        people: 2,
        amount: 49998,
        status: 'pending'
      }
    ],
    wishlist: [
      {
        id: 1,
        name: 'Adventure Seeker',
        duration: '7 Days / 6 Nights',
        price: 19999,
        image: '/images/packages/adventure-seeker.jpg'
      },
      {
        id: 2,
        name: 'Family Vacation',
        duration: '6 Days / 5 Nights',
        price: 18999,
        image: '/images/packages/family-vacation.jpg'
      }
    ],
    reviews: [
      {
        id: 201,
        package: 'Budget Friendly',
        rating: 4.5,
        comment: 'Great experience for the price. The accommodations were clean and comfortable.',
        date: '2025-03-20'
      }
    ],
    notifications: [
      {
        id: 301,
        message: 'Your booking #101 has been confirmed.',
        date: '2025-04-01',
        read: true
      },
      {
        id: 302,
        message: 'Special offer: Get 10% off on Adventure Seeker package.',
        date: '2025-04-02',
        read: false
      },
      {
        id: 303,
        message: 'Your payment for booking #102 is pending.',
        date: '2025-04-02',
        read: false
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="mt-2">Manage your bookings, wishlist, and account settings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Profile Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-blue-600">{userData.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-gray-600">Member since {userData.joinDate}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/user/edit-profile"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition duration-300"
              >
                Edit Profile
              </Link>
              <Link 
                href="/packages"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Browse Packages
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 font-medium mb-2">Bookings</h3>
            <p className="text-3xl font-bold">{userData.bookings.length}</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>Confirmed: {userData.bookings.filter(b => b.status === 'confirmed').length}</p>
              <p>Pending: {userData.bookings.filter(b => b.status === 'pending').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 font-medium mb-2">Wishlist</h3>
            <p className="text-3xl font-bold">{userData.wishlist.length}</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>Packages saved for later</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 font-medium mb-2">Notifications</h3>
            <p className="text-3xl font-bold">{userData.notifications.filter(n => !n.read).length}</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>Unread notifications</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'bookings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              My Bookings
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'wishlist' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('wishlist')}
            >
              Wishlist
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'reviews' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              My Reviews
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'notifications' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'account' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
          </div>

          <div className="p-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                {userData.bookings.length > 0 ? (
                  <div className="space-y-6">
                    {userData.bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b">
                          <div className="flex flex-wrap justify-between items-center">
                            <div>
                              <h3 className="text-lg font-semibold">{booking.package}</h3>
                              <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Travel Dates</p>
                              <div className="flex items-center mt-1">
                                <Calendar size={16} className="mr-2 text-gray-400" />
                                <p className="text-sm">
                                  {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Travelers</p>
                              <div className="flex items-center mt-1">
                                <User size={16} className="mr-2 text-gray-400" />
                                <p className="text-sm">{booking.people} {booking.people === 1 ? 'Person' : 'People'}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Amount Paid</p>
                              <div className="flex items-center mt-1">
                                <CreditCard size={16} className="mr-2 text-gray-400" />
                                <p className="text-sm">₹{booking.amount.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                            <div className="flex items-end justify-end">
                              <Link 
                                href={`/user/bookings/${booking.id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
                    <Link 
                      href="/packages"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Browse Packages
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                {userData.wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userData.wishlist.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        <div className="h-40 bg-blue-100 relative">
                          {/* Placeholder for package image */}
                          {/* <Image src={item.image} alt={item.name} fill className="object-cover" /> */}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Clock size={16} className="mr-2" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="font-medium">₹{item.price.toLocaleString('en-IN')}</p>
                            <Link 
                              href={`/packages/${item.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Package
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-4">Save packages you're interested in for later.</p>
                    <Link 
                      href="/packages"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Browse Packages
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {userData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {userData.reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{review.package}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                className={i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">
                          Reviewed on {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No reviews yet</h3>
                    <p className="text-gray-500">You haven't submitted any reviews yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                {userData.notifications.length > 0 ? (
                  <div className="space-y-4">
                    {userData.notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`border rounded-lg p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                      >
                        <div className="flex items-start">
                          <Bell size={20} className={`mr-3 flex-shrink-0 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                          <div>
                            <p className={`${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No notifications</h3>
                    <p className="text-gray-500">You don't have any notifications at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div>
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userData.name}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userData.email}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={userData.phone}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link 
                      href="/user/edit-profile"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Edit Profile
                    </Link>
                  </div>

                  <hr className="my-8" />

                  <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value="••••••••"
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link 
                      href="/user/change-password"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition duration-300"
                    >
                      Change Password
                    </Link>
                  </div>

                  <hr className="my-8" />

                  <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                        Receive email notifications about bookings and offers
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sms-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                        Receive SMS notifications about bookings
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="marketing-emails"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-700">
                        Receive marketing emails about special offers and promotions
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
