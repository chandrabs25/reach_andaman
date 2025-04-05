// Path: .\src\app\user\dashboard\page.tsx
'use client';

import React, { useState } from 'react'; // Import React
import Link from 'next/link';
import { MapPin, Calendar, Clock, CreditCard, User, Star, Package, Bell, LogOut, Home, Users as UsersIcon, FileText, Shield } from 'lucide-react'; // Added missing imports

// --- Define Interfaces ---
type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'; // Define possible statuses

interface Booking {
  id: number;
  package: string;
  startDate: string;
  endDate: string;
  people: number;
  amount: number;
  status: BookingStatus;
}

interface WishlistItem {
  id: number;
  name: string;
  duration: string;
  price: number;
  image: string;
}

interface Review {
  id: number;
  package: string;
  rating: number;
  comment: string;
  date: string;
}

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  bookings: Booking[];
  wishlist: WishlistItem[];
  reviews: Review[];
  notifications: Notification[];
}
// --- End Interfaces ---


export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');

  // Mock user data (Typed)
  const userData: UserData = { // Use the UserData type
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    joinDate: 'January 2025',
    bookings: [
      { id: 101, package: 'Andaman Explorer', startDate: '2025-05-15', endDate: '2025-05-19', people: 2, amount: 31998, status: 'confirmed' },
      { id: 102, package: 'Honeymoon Special', startDate: '2025-06-10', endDate: '2025-06-15', people: 2, amount: 49998, status: 'pending' }
      // Add more mock bookings if needed
    ],
    wishlist: [
      { id: 1, name: 'Adventure Seeker', duration: '7 Days / 6 Nights', price: 19999, image: '/images/packages/adventure-seeker.jpg' },
      { id: 2, name: 'Family Vacation', duration: '6 Days / 5 Nights', price: 18999, image: '/images/packages/family-vacation.jpg' }
    ],
    reviews: [
      { id: 201, package: 'Budget Friendly', rating: 4.5, comment: 'Great experience for the price. The accommodations were clean and comfortable.', date: '2025-03-20' }
    ],
    notifications: [
      { id: 301, message: 'Your booking #101 has been confirmed.', date: '2025-04-01', read: true },
      { id: 302, message: 'Special offer: Get 10% off on Adventure Seeker package.', date: '2025-04-02', read: false },
      { id: 303, message: 'Your payment for booking #102 is pending.', date: '2025-04-02', read: false }
    ]
  };

  // --- FIX: Add type annotation to 'status' parameter ---
  const getStatusColor = (status: BookingStatus): string => { // Use BookingStatus type and return string
  // --- End FIX ---
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed': // Assuming you might have this status later
         return 'bg-blue-100 text-blue-800';
      case 'cancelled': // Assuming you might have this status later
        return 'bg-red-100 text-red-800';
      default:
        // Handle unexpected status, maybe log it
        console.warn(`Unexpected booking status: ${status}`);
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format date (optional helper)
  const formatDate = (dateString: string) => {
     try {
         return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
     } catch {
         return dateString; // Return original if invalid
     }
  };

  // --- JSX remains largely the same ---
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
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
             {/* Profile Info */}
             <div className="flex items-center mb-4 md:mb-0"> <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4"> <span className="text-2xl font-bold text-blue-600">{userData.name.charAt(0)}</span> </div> <div> <h2 className="text-xl font-semibold">{userData.name}</h2> <p className="text-gray-600 text-sm">Member since {userData.joinDate}</p> </div> </div>
             {/* Action Buttons */}
             <div className="flex flex-wrap gap-2 sm:gap-4"> <Link href="/user/edit-profile" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition duration-300"> Edit Profile </Link> <Link href="/packages" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"> Browse Packages </Link> </div>
          </div>
        </div>

        {/* Dashboard Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> {/* Changed to 4 cols for stats */}
             {/* Bookings Stat */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6"> <h3 className="text-sm font-medium text-gray-500 mb-1">Bookings</h3> <p className="text-2xl sm:text-3xl font-bold">{userData.bookings.length}</p> <p className="mt-1 text-xs text-gray-600"> {userData.bookings.filter(b => b.status === 'confirmed').length} confirmed, {userData.bookings.filter(b => b.status === 'pending').length} pending </p> </div>
             {/* Wishlist Stat */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6"> <h3 className="text-sm font-medium text-gray-500 mb-1">Wishlist</h3> <p className="text-2xl sm:text-3xl font-bold">{userData.wishlist.length}</p> <p className="mt-1 text-xs text-gray-600"> Saved packages </p> </div>
             {/* Reviews Stat */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6"> <h3 className="text-sm font-medium text-gray-500 mb-1">Reviews</h3> <p className="text-2xl sm:text-3xl font-bold">{userData.reviews.length}</p> <p className="mt-1 text-xs text-gray-600"> Reviews submitted </p> </div>
             {/* Notifications Stat */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6"> <h3 className="text-sm font-medium text-gray-500 mb-1">Notifications</h3> <p className="text-2xl sm:text-3xl font-bold">{userData.notifications.filter(n => !n.read).length}</p> <p className="mt-1 text-xs text-gray-600"> Unread notifications </p> </div>
         </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b overflow-x-auto">
             {/* Tab Buttons */}
             {(['bookings', 'wishlist', 'reviews', 'notifications', 'account'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${ activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600' }`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
             ))}
          </div>

          <div className="p-6">
            {/* Bookings Tab Content */}
            {activeTab === 'bookings' && (
              <div>
                 {/* Booking list or empty state */}
                 {userData.bookings.length > 0 ? ( <div className="space-y-4"> {userData.bookings.map((booking) => ( <div key={booking.id} className="border rounded-lg p-4"> {/* Booking item */} <div className="flex flex-wrap justify-between items-center mb-2"> <h3 className="font-semibold">{booking.package}</h3> <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} </span> </div> <div className="text-sm text-gray-600 grid grid-cols-2 sm:grid-cols-4 gap-2"> <div><Calendar size={14} className="inline mr-1" /> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</div> <div><UsersIcon size={14} className="inline mr-1" /> {booking.people} People</div> <div><CreditCard size={14} className="inline mr-1" /> ₹{booking.amount.toLocaleString()}</div> <div className="text-right"> <Link href={`/user/bookings/${booking.id}`} className="text-blue-600 hover:underline"> View Details </Link> </div> </div> </div> ))} </div> ) : ( <div className="text-center py-8"> {/* Empty state */} <p>No bookings yet.</p> </div> )}
              </div>
            )}

            {/* Wishlist Tab Content */}
            {activeTab === 'wishlist' && (
               <div>
                  {/* Wishlist grid or empty state */}
                  {userData.wishlist.length > 0 ? ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {userData.wishlist.map((item) => ( <div key={item.id} className="border rounded-lg overflow-hidden"> {/* Wishlist item */} <div className="h-32 bg-gray-200"></div> <div className="p-3"> <p>{item.name}</p> <p>₹{item.price.toLocaleString()}</p> <Link href={`/packages/${item.id}`}>View</Link> </div> </div> ))} </div> ) : ( <div className="text-center py-8"><p>Wishlist is empty.</p></div> )}
               </div>
            )}

            {/* Reviews Tab Content */}
            {activeTab === 'reviews' && (
               <div>
                   {/* Review list or empty state */}
                   {userData.reviews.length > 0 ? ( <div className="space-y-4"> {userData.reviews.map((review) => ( <div key={review.id} className="border rounded-lg p-4"> {/* Review item */} <p>{review.package}</p> <p>Rating: {review.rating}/5</p> <p>{review.comment}</p> <p>{formatDate(review.date)}</p> </div> ))} </div> ) : ( <div className="text-center py-8"><p>No reviews yet.</p></div> )}
               </div>
            )}

            {/* Notifications Tab Content */}
            {activeTab === 'notifications' && (
               <div>
                  {/* Notification list or empty state */}
                  {userData.notifications.length > 0 ? ( <div className="space-y-3"> {userData.notifications.map((notification) => ( <div key={notification.id} className={`border rounded-lg p-3 ${!notification.read ? 'bg-blue-50' : ''}`}> {/* Notification item */} <p>{notification.message}</p> <p>{formatDate(notification.date)}</p> </div> ))} </div> ) : ( <div className="text-center py-8"><p>No notifications.</p></div> )}
               </div>
            )}

            {/* Account Settings Tab Content */}
            {activeTab === 'account' && (
               <div className="max-w-xl">
                   {/* Account settings form */}
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    {/* ... inputs for name, email, phone (read-only maybe) ... */}
                     <div className="mb-4"> <label>Name</label> <input type="text" value={userData.name} readOnly className="w-full p-2 border rounded bg-gray-100"/> </div>
                     <div className="mb-4"> <label>Email</label> <input type="email" value={userData.email} readOnly className="w-full p-2 border rounded bg-gray-100"/> </div>
                     <div className="mb-4"> <label>Phone</label> <input type="tel" value={userData.phone} readOnly className="w-full p-2 border rounded bg-gray-100"/> </div>
                    <div className="flex justify-end mb-6"> <Link href="/user/edit-profile" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"> Edit Profile </Link> </div>
                     <hr className="my-6"/>
                     <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                     <div className="mb-4"> <label>Password</label> <input type="password" value="••••••••" readOnly className="w-full p-2 border rounded bg-gray-100"/> </div>
                     <div className="flex justify-end"> <Link href="/user/change-password" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"> Change Password </Link> </div>

               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}