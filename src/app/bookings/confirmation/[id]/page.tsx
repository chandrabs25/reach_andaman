"use client"; // Add this line at the top

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BookingConfirmationPage({
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
    return (
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Booking Not Found</h2>
        <p className="mt-2 text-gray-600">The booking you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <CheckCircle className="h-24 w-24 text-green-500" />
        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="text-gray-600">
          Your booking with ID <span className="font-semibold">{booking.id}</span> has been confirmed.
        </p>
        <p className="text-gray-600">
          Thank you for choosing us. We look forward to serving you!
        </p>
        <div className="flex space-x-4">
          <Link href="/user/bookings">
            <Button variant="outline">View Bookings</Button>
          </Link>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
