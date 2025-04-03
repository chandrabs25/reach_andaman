import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

// Default test keys for development environment
const DEFAULT_KEY_ID = 'rzp_test_default12345';
const DEFAULT_KEY_SECRET = 'defaultsecret12345';

// Initialize Razorpay with API keys, using fallback values if environment variables are not set
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || DEFAULT_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET || DEFAULT_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Extract amount and currency from request body
    const { amount, currency, receipt } = await request.json() as {
      amount: number;
      currency: string;
      receipt: string;
    };

    // Create options for Razorpay order
    const options = {
      amount: (amount * 100).toString(), // Razorpay expects amount in paise (multiply by 100)
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        orderType: 'Andaman Travel Booking',
      }
    };

    // Create order in Razorpay
    const order = await razorpay.orders.create(options);
    
    // Log order details for debugging
    console.log('Razorpay Order Created:', order);
    
    // Return order ID to client
    return NextResponse.json({ 
      orderId: order.id,
      status: 200 
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ 
      message: 'Failed to create payment order', 
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500 
    }, { status: 500 });
  }
}
