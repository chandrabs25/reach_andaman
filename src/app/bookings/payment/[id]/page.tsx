"use client"; // Add this line at the top

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RazorpayPayment from '@/components/RazorpayPayment';

export default function PaymentPage({
  params
}: {
  params: { id: string };
}) {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const bookingId = params.id;

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }
        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  if (!booking) {
    return <div className="text-center">Booking not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Payment for Booking {booking.id}</h1>
      <RazorpayPayment booking={booking} />
    </div>
  );
}
