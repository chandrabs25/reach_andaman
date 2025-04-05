// Path: .\src\app\bookings\payment\[id]\page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation';
import RazorpayPayment from '@/components/RazorpayPayment'; // Assuming this path is correct

// --- Define interface for the detailed booking data ---
interface BookingData {
  id: string;
  packageName: string;
  startDate: string;
  endDate: string;
  guests: number;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // Add any other relevant fields from your booking object
}

// --- Define interface for the component's state ---
interface BookingDetailsState {
  id: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingData: BookingData | null; // Allow object or null
}


export default function PaymentPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  // --- FIX: Initialize state with correct type for bookingData ---
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsState>({
    id: params.id,
    amount: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingData: null // Initialize as null
  });
  // --- End of FIX ---

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

  // Fetch booking details when component mounts
  // --- FIX: Use useEffect for data fetching ---
  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoading(true); // Ensure loading state is true
      try {
        // In a real implementation, this would fetch booking details from the API
        // const response = await fetch(`/api/bookings/${params.id}`);
        // if (!response.ok) throw new Error('Failed to fetch booking details');
        // const data = await response.json();
        // const fetchedBooking = data.booking; // Assuming API returns { booking: {...} }

        // Mock data for demonstration
        const mockData: BookingData = { // Use the BookingData interface here
          id: params.id,
          packageName: 'Havelock Island Adventure',
          startDate: '2025-05-15',
          endDate: '2025-05-20',
          guests: 2,
          amount: 25000, // This should likely match the amount fetched or calculated
          customerName: 'Rahul Sharma',
          customerEmail: 'rahul.s@example.com',
          customerPhone: '9876543210',
        };

        // --- FIX: Update state correctly ---
        setBookingDetails({
          id: params.id, // Or fetchedBooking.id
          amount: mockData.amount, // Or fetchedBooking.amount
          customerName: mockData.customerName, // Or fetchedBooking.customerName etc.
          customerEmail: mockData.customerEmail,
          customerPhone: mockData.customerPhone,
          bookingData: mockData // Assign the object to bookingData
        });
        // --- End of FIX ---

      } catch (error) {
        console.error('Error fetching booking details:', error);
        // Handle error state, e.g., show an error message
        setBookingDetails(prev => ({ ...prev, bookingData: null })); // Reset bookingData on error
      } finally {
        setIsLoading(false); // Set loading false in finally block
      }
    };

    fetchBookingDetails();
  }, [params.id]); // Add params.id as dependency
  // --- End of FIX ---


  const handlePaymentSuccess = (response: any) => {
    console.log("Payment Successful:", response); // Log success response
    setPaymentStatus('success');
    setPaymentResponse(response);

    // Update booking status in the database (example placeholder)
    // updateBookingStatus(params.id, 'confirmed', response.razorpay_payment_id);

    setTimeout(() => {
      // Pass payment ID to confirmation page
      router.push(`/bookings/confirmation/${params.id}?paymentId=${response.razorpay_payment_id}`);
    }, 2000);
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment Failed:', error); // Log error details
    setPaymentStatus('failed');
    setPaymentResponse(error);

     // Update booking status in the database (example placeholder)
     // updateBookingStatus(params.id, 'payment_failed');

    // Maybe show more specific error message from response.error.description
  };

  // Optional: Function to update booking status via API
  // const updateBookingStatus = async (bookingId, status, paymentId = null) => {
  //    try {
  //       await fetch(`/api/bookings/${bookingId}`, {
  //          method: 'PUT',
  //          headers: { 'Content-Type': 'application/json' },
  //          body: JSON.stringify({ status: status, paymentStatus: status === 'confirmed' ? 'completed' : 'failed', paymentId: paymentId })
  //       });
  //    } catch (err) {
  //       console.error("Failed to update booking status:", err);
  //    }
  // };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Handle case where booking details failed to load
   if (!bookingDetails.bookingData && !isLoading) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="text-center p-6 bg-white rounded shadow-md">
           <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Booking</h2>
           <p className="text-gray-600 mb-4">Could not load the details for this booking. Please try again later or contact support.</p>
           <button onClick={() => router.back()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
             Go Back
           </button>
         </div>
       </div>
     );
   }

  // --- JSX remains largely the same, uses bookingDetails.bookingData ---
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">Complete Your Payment</h1>
          </div>

          <div className="p-6">
            {paymentStatus === 'idle' && bookingDetails.bookingData && ( // Ensure bookingData exists before rendering
              <>
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
                  <div className="border-t border-b py-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Booking ID</span>
                      <span className="font-medium">{bookingDetails.id}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Package</span>
                      {/* Access nested data safely */}
                      <span className="font-medium">{bookingDetails.bookingData?.packageName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Dates</span>
                      <span className="font-medium">
                        {bookingDetails.bookingData?.startDate} to {bookingDetails.bookingData?.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{bookingDetails.bookingData?.guests}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <span className="text-gray-800 font-semibold">Total Amount</span>
                      <span className="text-xl font-bold">₹{bookingDetails.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                   {/* ... Razorpay Logo ... */}
                   <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <div className="flex items-center">
                      {/* Assuming you have a logo */}
                       <div className="h-8 w-auto mr-3"> <img src="/razorpay-logo.png" alt="Razorpay" className="h-full w-auto object-contain" /> </div>
                       <div> <p className="font-medium">Razorpay</p> <p className="text-sm text-gray-500">Secure payment gateway</p> </div>
                     </div>
                   </div>
                </div>

                <RazorpayPayment
                  amount={bookingDetails.amount}
                  bookingDetails={{ // Pass necessary details for prefill/notes
                    id: bookingDetails.id,
                    customerName: bookingDetails.customerName,
                    customerEmail: bookingDetails.customerEmail,
                    customerPhone: bookingDetails.customerPhone,
                    type: 'Package', // Or dynamically set based on booking type
                    packageName: bookingDetails.bookingData?.packageName,
                    // Add other details as needed by Razorpay or verification
                  }}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />

                <p className="text-sm text-gray-500 mt-4 text-center">
                  By proceeding with the payment, you agree to our terms and conditions.
                </p>
              </>
            )}

            {/* ... Payment Status messages (success/failed) ... */}
             {paymentStatus === 'success' && ( <div className="text-center py-8"> {/* ... Success Icon/Text ... */} <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2> {/* ... More details ... */} <p className="text-gray-600">Redirecting to confirmation page...</p> </div> )}
             {paymentStatus === 'failed' && ( <div className="text-center py-8"> {/* ... Failure Icon/Text ... */} <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2> {/* ... Error message ... */} <button onClick={() => setPaymentStatus('idle')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"> Try Again </button> </div> )}

          </div>
        </div>
      </div>
    </div>
  );
}