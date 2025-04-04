

import { useState } from 'react';
import { useRouter } from 'next/navigation';
export const runtime = 'edge';
export default function BookingConfirmationPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    id: params.id,
    packageName: 'Havelock Island Adventure',
    startDate: '2025-05-15',
    endDate: '2025-05-20',
    guests: 2,
    amount: 25000,
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.s@example.com',
    customerPhone: '9876543210',
    paymentId: '',
    paymentDate: new Date().toISOString(),
    vendorName: 'Andaman Adventures',
    vendorEmail: 'info@andamanadventures.com',
    vendorPhone: '9876543200'
  });

  // In a real implementation, fetch booking details from API
  useState(() => {
    // Get payment ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId') || '';
    
    setBookingDetails(prev => ({
      ...prev,
      paymentId
    }));
  }, []);

  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate and download a PDF receipt
    alert('Receipt download functionality will be implemented in production');
  };

  const handleViewItinerary = () => {
    router.push(`/packages/${bookingDetails.packageName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 border-b text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">Your booking has been successfully confirmed and payment has been processed.</p>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Booking Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                    <p className="font-medium">{bookingDetails.id}</p>
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
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Payment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                    <p className="font-medium">₹{bookingDetails.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment ID</p>
                    <p className="font-medium">{bookingDetails.paymentId}</p>
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
                    <p className="font-medium">Razorpay</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                    <p className="font-medium">{bookingDetails.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{bookingDetails.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{bookingDetails.customerPhone}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Vendor Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vendor Name</p>
                    <p className="font-medium">{bookingDetails.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{bookingDetails.vendorEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{bookingDetails.vendorPhone}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mb-8">
                <p className="text-sm text-blue-700">
                  A confirmation email has been sent to your email address with all the details of your booking.
                  Please keep this information for your reference.
                </p>
              </div>
              
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
