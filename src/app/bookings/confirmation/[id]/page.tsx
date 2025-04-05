// Path: .\src\app\bookings\confirmation\[id]\page.tsx
'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation';

export default function BookingConfirmationPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Keep if needed later for API calls

  // --- FIX: Initialize state with useState (only initial value) ---
  const [bookingDetails, setBookingDetails] = useState({
    id: params.id, // Use param directly for initial ID
    packageName: 'Havelock Island Adventure', // Mock data
    startDate: '2025-05-15',                 // Mock data
    endDate: '2025-05-20',                   // Mock data
    guests: 2,                               // Mock data
    amount: 25000,                           // Mock data
    customerName: 'Rahul Sharma',            // Mock data
    customerEmail: 'rahul.s@example.com',    // Mock data
    customerPhone: '9876543210',             // Mock data
    paymentId: '', // Initialize paymentId as empty
    paymentDate: new Date().toISOString(),   // Mock data
    vendorName: 'Andaman Adventures',        // Mock data
    vendorEmail: 'info@andamanadventures.com', // Mock data
    vendorPhone: '9876543200'                 // Mock data
  });
  // --- End of FIX ---

  // --- FIX: Use useEffect to get paymentId from URL on component mount ---
  useEffect(() => {
    // This code runs only once after the component mounts on the client-side
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIdFromUrl = urlParams.get('paymentId') || ''; // Get paymentId or default to empty string

    // Update the state with the fetched paymentId
    setBookingDetails(prevDetails => ({
      ...prevDetails, // Keep existing details
      paymentId: paymentIdFromUrl // Update only the paymentId
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount
  // --- End of FIX ---


  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    alert('Receipt download functionality will be implemented in production');
  };

  const handleViewItinerary = () => {
    // Use a more robust way to generate the package slug if possible
    const packageSlug = bookingDetails.packageName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/packages/${packageSlug}`); // Navigate to package detail page
  };

  // --- JSX remains largely the same ---
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 border-b text-center">
              {/* ... Icon and Confirmation Text ... */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">Your booking has been successfully confirmed and payment has been processed.</p>
            </div>

            <div className="p-6">
              {/* Booking Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Booking Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                    <p className="font-medium break-words">{bookingDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Package</p>
                    <p className="font-medium">{bookingDetails.packageName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Travel Dates</p>
                    <p className="font-medium">{bookingDetails.startDate} to {bookingDetails.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Number of Guests</p>
                    <p className="font-medium">{bookingDetails.guests}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Payment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                    <p className="font-medium">₹{bookingDetails.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment ID</p>
                    <p className="font-medium break-words">{bookingDetails.paymentId || 'N/A'}</p> {/* Show N/A if empty */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Date</p>
                    <p className="font-medium">{new Date(bookingDetails.paymentDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium">Razorpay</p> {/* Assuming Razorpay */}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                 <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Contact Information</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ... Customer details ... */}
                     <div> <p className="text-sm text-gray-500 mb-1">Customer Name</p> <p className="font-medium">{bookingDetails.customerName}</p> </div>
                     <div> <p className="text-sm text-gray-500 mb-1">Email</p> <p className="font-medium break-words">{bookingDetails.customerEmail}</p> </div>
                     <div> <p className="text-sm text-gray-500 mb-1">Phone</p> <p className="font-medium">{bookingDetails.customerPhone}</p> </div>
                 </div>
              </div>

              {/* Vendor Information */}
               <div className="mb-8">
                 <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Vendor Information</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* ... Vendor details ... */}
                    <div> <p className="text-sm text-gray-500 mb-1">Vendor Name</p> <p className="font-medium">{bookingDetails.vendorName}</p> </div>
                    <div> <p className="text-sm text-gray-500 mb-1">Email</p> <p className="font-medium break-words">{bookingDetails.vendorEmail}</p> </div>
                    <div> <p className="text-sm text-gray-500 mb-1">Phone</p> <p className="font-medium">{bookingDetails.vendorPhone}</p> </div>
                 </div>
               </div>

              {/* Confirmation Message */}
              <div className="bg-blue-50 p-4 rounded-md mb-8">
                <p className="text-sm text-blue-700">
                  A confirmation email has been sent to your email address with all the details of your booking.
                  Please keep this information for your reference.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <button
                  onClick={handleDownloadReceipt}
                  className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md flex-1"
                >
                  Download Receipt
                </button>
                <button
                  onClick={handleViewItinerary}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex-1"
                >
                  View Itinerary
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}