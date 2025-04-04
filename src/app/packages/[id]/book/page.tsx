

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, CreditCard, Check, AlertTriangle } from 'lucide-react';
export const runtime = 'edge';
export default function BookingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    adults: 2,
    children: 0,
    startDate: '',
    specialRequests: ''
  });
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Mock package data
  const packageData = {
    id: 1,
    name: 'Andaman Explorer',
    duration: '5 Days / 4 Nights',
    price: 15999,
    startDates: ['2025-05-10', '2025-05-17', '2025-05-24', '2025-06-01'],
    maxPeople: 15
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10)
    });
  };

  const calculateTotal = () => {
    const adultTotal = formData.adults * packageData.price;
    const childTotal = formData.children * (packageData.price * 0.7); // 30% discount for children
    return adultTotal + childTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would submit the booking to the backend
    alert('Booking submitted successfully! You will receive a confirmation email shortly.');
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Book Your Package</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-3xl">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <span className="mt-2 text-sm">Details</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className="mt-2 text-sm">Review</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                          Adults
                        </label>
                        <select
                          id="adults"
                          name="adults"
                          value={formData.adults}
                          onChange={handleNumberChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
                          Children (2-12 yrs)
                        </label>
                        <select
                          id="children"
                          name="children"
                          value={formData.children}
                          onChange={handleNumberChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <select
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select a date</option>
                          {packageData.startDates.map((date) => (
                            <option key={date} value={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any dietary requirements, accessibility needs, or other special requests?"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-300"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Step 2: Review Booking */}
              {step === 2 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Review Your Booking</h2>
                  
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Package Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Package Name</p>
                        <p className="font-medium">{packageData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{packageData.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium">
                          {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium">
                          {formData.startDate ? 
                            new Date(new Date(formData.startDate).setDate(new Date(formData.startDate).getDate() + 4)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                            : 'Not selected'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Traveler Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{formData.email} | {formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Number of Travelers</p>
                        <p className="font-medium">{formData.adults} Adults, {formData.children} Children</p>
                      </div>
                    </div>
                  </div>
                  
                  {formData.specialRequests && (
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Special Requests</h3>
                      <p className="text-sm">{formData.specialRequests}</p>
                    </div>
                  )}
                  
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Price Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm">Adults ({formData.adults} × ₹{packageData.price.toLocaleString('en-IN')})</p>
                        <p className="text-sm">₹{(formData.adults * packageData.price).toLocaleString('en-IN')}</p>
                      </div>
                      {formData.children > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm">Children ({formData.children} × ₹{(packageData.price * 0.7).toLocaleString('en-IN')})</p>
                          <p className="text-sm">₹{(formData.children * packageData.price * 0.7).toLocaleString('en-IN')}</p>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                        <p>Total Amount</p>
                        <p>₹{calculateTotal().toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md transition duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-300"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Select Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`border rounded-md p-4 cursor-pointer ${
                          paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border ${
                            paymentMethod === 'card' ? 'border-blue-600' : 'border-gray-300'
                          } flex items-center justify-center mr-3`}>
                            {paymentMethod === 'card' && (
                              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                          </div>
                        </div>
                      </div>
                      
                      <div
                        className={`border rounded-md p-4 cursor-pointer ${
                          paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border ${
                            paymentMethod === 'upi' ? 'border-blue-600' : 'border-gray-300'
                          } flex items-center justify-center mr-3`}>
                            {paymentMethod === 'upi' && (
                              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">UPI</p>
                            <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                          </div>
                        </div>
                      </div>
                      
                      <div
                        className={`border rounded-md p-4 cursor-pointer ${
                          paymentMethod === 'netbanking' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('netbanking')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border ${
                            paymentMethod === 'netbanking' ? 'border-blue-600' : 'border-gray-300'
                          } flex items-center justify-center mr-3`}>
                            {paymentMethod === 'netbanking' && (
                              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Net Banking</p>
                            <p className="text-xs text-gray-500">All major banks</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="mb-6">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium text-gray-700 mb-4">Card Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="expiryDate"
                                placeholder="MM/YY"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                placeholder="123"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              id="nameOnCard"
                              placeholder="John Doe"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'upi' && (
                    <div className="mb-6">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium text-gray-700 mb-4">UPI Details</h3>
                        <div>
                          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                            UPI ID
                          </label>
                          <input
                            type="text"
                            id="upiId"
                            placeholder="name@upi"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === 'netbanking' && (
                    <div className="mb-6">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium text-gray-700 mb-4">Select Bank</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak', 'Yes Bank', 'Other'].map((bank) => (
                            <div key={bank} className="border rounded-md p-3 text-center cursor-pointer hover:bg-gray-50">
                              {bank}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                          I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md transition duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-300"
                    >
                      Pay ₹{calculateTotal().toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">{packageData.name}</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock size={16} className="mr-2" />
                    <span>{packageData.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {formData.startDate ? 
                        new Date(formData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                        : 'Select a date'}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Adults ({formData.adults})</span>
                    <span className="text-sm">₹{(formData.adults * packageData.price).toLocaleString('en-IN')}</span>
                  </div>
                  {formData.children > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Children ({formData.children})</span>
                      <span className="text-sm">₹{(formData.children * packageData.price * 0.7).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-2">Important Information</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check size={16} className="mr-2 text-green-500 flex-shrink-0 mt-1" />
                      <span>Free cancellation up to 7 days before start date</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle size={16} className="mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                      <span>50% refund for cancellations between 3-7 days before start</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle size={16} className="mr-2 text-red-500 flex-shrink-0 mt-1" />
                      <span>No refund for cancellations less than 3 days before start</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
