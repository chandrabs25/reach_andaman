"use client"; // Add this line at the top

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, CreditCard, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PackageBookingPage() {
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState(null);
  const router = useRouter();
  const params = useParams();
  const packageId = params.id;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${packageId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch package');
        }
        const data = await response.json();
        setPackageData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (startDate && endDate && guests) {
        try {
          const response = await fetch(`/api/availability?packageId=${packageId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&guests=${guests}`);
          if (!response.ok) {
            throw new Error('Failed to check availability');
          }
          const data = await response.json();
          setAvailability(data);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    checkAvailability();
  }, [startDate, endDate, guests, packageId]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  if (!packageData) {
    return <div className="text-center">Package not found</div>;
  }

  const handleBookNow = async () => {
    if (!startDate || !endDate || !guests) {
      alert('Please select start date, end date, and number of guests.');
      return;
    }

    if (!availability || !availability.available) {
      alert('The selected dates or number of guests are not available.');
      return;
    }

    const bookingDetails = {
      packageId: packageId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      guests: guests,
      amount: availability.pricing.totalAmount
    };

    router.push(`/bookings/payment/${packageId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book {packageData.name}</h1>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          <p className="text-gray-600">Destinations: {packageData.destinations.join(', ')}</p>
        </div>
        <div className="flex items-center mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <p className="text-gray-600">Duration: {packageData.duration_days} Days / {packageData.duration_nights} Nights</p>
        </div>
        <div className="flex items-center mb-2">
          <Users className="h-4 w-4 mr-2" />
          <p className="text-gray-600">Price: ₹{packageData.price} per person</p>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Dates</h2>
        <div className="flex items-center space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            placeholderText="Start Date"
            className="border p-2 rounded"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="border p-2 rounded"
          />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Number of Guests</h2>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="border p-2 rounded"
        />
      </div>
      {availability && (
        <div className="mb-4">
          {availability.available ? (
            <div className="flex items-center text-green-500">
              <Check className="h-4 w-4 mr-2" />
              <p>Available</p>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <p>Not Available</p>
            </div>
          )}
          {availability.pricing && (
            <div className="mt-2">
              <p>Base Price: ₹{availability.pricing.basePrice}</p>
              <p>Taxes: ₹{availability.pricing.taxes}</p>
              <p className="font-semibold">Total Amount: ₹{availability.pricing.totalAmount}</p>
            </div>
          )}
          {availability.alternativeDates && availability.alternativeDates.length > 0 && (
            <div className="mt-2">
              <p>Alternative Dates:</p>
              <ul>
                {availability.alternativeDates.map((altDate, index) => (
                  <li key={index}>{altDate.startDate} to {altDate.endDate}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <Button onClick={handleBookNow} className="flex items-center space-x-2">
        <CreditCard className="h-4 w-4" />
        <span>Book Now</span>
      </Button>
    </div>
  );
}
