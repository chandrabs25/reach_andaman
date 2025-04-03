'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

interface PaymentProps {
  amount: number;
  bookingDetails: any;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export default function RazorpayPayment({ amount, bookingDetails, onSuccess, onFailure }: PaymentProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();

  // Function to create an order ID from the server
  const createOrderId = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `booking_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      if (onFailure) onFailure(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle payment
  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert('Razorpay SDK is still loading. Please try again in a moment.');
      return;
    }

    try {
      const orderId = await createOrderId();
      if (!orderId) return;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Andaman Travel Platform',
        description: 'Booking Payment',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verificationResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderCreationId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                bookingDetails: bookingDetails
              }),
            });

            const verificationResult = await verificationResponse.json();
            
            if (verificationResult.isOk) {
              // Payment successful
              if (onSuccess) {
                onSuccess({
                  ...response,
                  verificationResult
                });
              } else {
                // Default success behavior
                alert('Payment successful! Your booking has been confirmed.');
                router.push('/user/bookings');
              }
            } else {
              // Payment verification failed
              if (onFailure) {
                onFailure(verificationResult);
              } else {
                alert(`Payment verification failed: ${verificationResult.message}`);
              }
            }
          } catch (error) {
            console.error('Error during payment verification:', error);
            if (onFailure) onFailure(error);
          }
        },
        prefill: {
          name: bookingDetails?.customerName || '',
          email: bookingDetails?.customerEmail || '',
          contact: bookingDetails?.customerPhone || '',
        },
        notes: {
          booking_id: bookingDetails?.id || '',
          booking_type: bookingDetails?.type || 'Package',
        },
        theme: {
          color: '#0070f3',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        if (onFailure) {
          onFailure(response.error);
        } else {
          alert(`Payment failed: ${response.error.description}`);
        }
      });
      
      paymentObject.open();
    } catch (error) {
      console.error('Error in payment process:', error);
      if (onFailure) onFailure(error);
    }
  };

  // Handle script load event
  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  return (
    <div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleScriptLoad}
      />
      
      <button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>
      
      {!scriptLoaded && (
        <p className="text-sm text-gray-500 mt-2">Loading payment gateway...</p>
      )}
    </div>
  );
}
