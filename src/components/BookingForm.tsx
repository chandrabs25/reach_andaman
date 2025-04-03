'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingFormProps {
  packageId: string;
  packageName: string;
  basePrice: number;
}

export default function BookingForm({ packageId, packageName, basePrice }: BookingFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [alternativeDates, setAlternativeDates] = useState<Array<{startDate: string, endDate: string}>>([]);
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  // Check availability when dates and guests change
  useEffect(() => {
    if (startDate && endDate && guests > 0) {
      checkAvailability();
    }
  }, [startDate, endDate, guests]);

  // Function to check availability
  const checkAvailability = async () => {
    if (!startDate || !endDate) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/availability?packageId=${packageId}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&guests=${guests}`);
      const data = await response.json();
      
      setAvailability(data);
      
      if (!data.available && data.alternativeDates) {
        setAlternativeDates(data.alternativeDates);
      } else {
        setAlternativeDates([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking availability:', error);
      setError('Failed to check availability. Please try again.');
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Move to customer information step
      setStep(2);
      return;
    }
    
    if (step === 2) {
      try {
        setLoading(true);
        
        // Create booking
        const bookingData = {
          packageId,
          packageName,
          userId: 'user_123', // In a real app, this would come from authentication
          vendorId: 'vendor_456', // In a real app, this would be the actual vendor ID
          startDate: formatDate(startDate!),
          endDate: formatDate(endDate!),
          guests,
          amount: availability.pricing.totalAmount,
          customerInfo
        };
        
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create booking');
        }
        
        // Redirect to payment page
        router.push(`/bookings/payment/${data.booking.id}`);
      } catch (error) {
        console.error('Error creating booking:', error);
        setError('Failed to create booking. Please try again.');
        setLoading(false);
      }
    }
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Function to select alternative date
  const selectAlternativeDate = (startDate: string, endDate: string) => {
    setStartDate(new Date(startDate));
    setEndDate(new Date(endDate));
  };

  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Book {packageName}</h2>
      
      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Travel Dates
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholderText="Select start date"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholderText="Select end date"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          {loading && (
            <div className="mb-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Checking availability...</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {availability && !loading && (
            <div className="mb-6">
              {availability.available ? (
                <div className="p-3 bg-green-50 text-green-700 rounded-md mb-4">
                  <p className="font-medium">Available for your selected dates!</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Price:</span>
                      <span>₹{availability.pricing.basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & Fees:</span>
                      <span>₹{availability.pricing.taxes.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1 pt-1 border-t border-green-200">
                      <span>Total Amount:</span>
                      <span>₹{availability.pricing.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md mb-4">
                  <p className="font-medium">Not available for selected dates</p>
                  <p className="text-sm mt-1">{availability.message}</p>
                  
                  {alternativeDates.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-sm">Alternative dates available:</p>
                      <div className="mt-2 space-y-2">
                        {alternativeDates.map((dates, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectAlternativeDate(dates.startDate, dates.endDate)}
                            className="block w-full text-left p-2 text-sm bg-white border border-yellow-300 rounded-md hover:bg-yellow-50"
                          >
                            {new Date(dates.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                            {new Date(dates.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !availability?.available}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Customer Information
          </button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Trip Summary</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Dates:</span>
                  <p className="font-medium">
                    {startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                    {endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Guests:</span>
                  <p className="font-medium">{guests}</p>
                </div>
                <div className="col-span-2 mt-1 pt-1 border-t border-gray-200">
                  <span className="text-gray-600">Total Amount:</span>
                  <p className="font-medium">₹{availability?.pricing.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={customerInfo.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="md:w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="md:w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
