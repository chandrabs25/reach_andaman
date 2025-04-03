'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RazorpayPayment from '@/components/RazorpayPayment';

export default function PaymentPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    id: params.id,
    amount: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingData: null
  });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

  // Fetch booking details when component mounts
  useState(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would fetch booking details from the API
        // const response = await fetch(`/api/bookings/${params.id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = {
          id: params.id,
          packageName: 'Havelock Island Adventure',
          startDate: '2025-05-15',
          endDate: '2025-05-20',
          guests: 2,
          amount: 25000,
          customerName: 'Rahul Sharma',
          customerEmail: 'rahul.s@example.com',
          customerPhone: '9876543210',
        };
        
        setBookingDetails({
          id: params.id,
          amount: mockData.amount,
          customerName: mockData.customerName,
          customerEmail: mockData.customerEmail,
          customerPhone: mockData.customerPhone,
          bookingData: mockData
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [params.id]);

  const handlePaymentSuccess = (response: any) => {
    setPaymentStatus('success');
    setPaymentResponse(response);
    
    // In a real implementation, you would update the booking status in the database
    // and redirect to a confirmation page
    setTimeout(() => {
      router.push(`/bookings/confirmation/${params.id}?paymentId=${response.razorpay_payment_id}`);
    }, 2000);
  };

  const handlePaymentFailure = (error: any) => {
    setPaymentStatus('failed');
    setPaymentResponse(error);
    
    // In a real implementation, you would log the error and possibly retry
    console.error('Payment failed:', error);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">Complete Your Payment</h1>
          </div>
          
          <div className="p-6">
            {paymentStatus === 'idle' && (
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
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 mr-3">
                        <img src="/razorpay-logo.png" alt="Razorpay" className="h-full w-full object-contain" />
                      </div>
                      <div>
                        <p className="font-medium">Razorpay</p>
                        <p className="text-sm text-gray-500">Secure payment gateway</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <RazorpayPayment 
                  amount={bookingDetails.amount} 
                  bookingDetails={{
                    id: bookingDetails.id,
                    customerName: bookingDetails.customerName,
                    customerEmail: bookingDetails.customerEmail,
                    customerPhone: bookingDetails.customerPhone,
                    type: 'Package',
                    packageName: bookingDetails.bookingData?.packageName,
                    startDate: bookingDetails.bookingData?.startDate,
                    endDate: bookingDetails.bookingData?.endDate,
                    guests: bookingDetails.bookingData?.guests
                  }}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  By proceeding with the payment, you agree to our terms and conditions.
                </p>
              </>
            )}
            
            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
                <p className="text-sm text-gray-500 mb-6">Transaction ID: {paymentResponse?.razorpay_payment_id}</p>
                <p className="text-gray-600">Redirecting to confirmation page...</p>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-4">
                  {paymentResponse?.description || 'There was an issue processing your payment.'}
                </p>
                <button 
                  onClick={() => setPaymentStatus('idle')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
