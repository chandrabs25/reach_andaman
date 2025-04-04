import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
// Function to generate signature for verification
const generateSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      'Razorpay key secret is not defined in environment variables.'
    );
  }
  
  const signature = crypto
    .createHmac('sha256', keySecret)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');
    
  return signature;
};

export async function POST(request: NextRequest) {
  try {
    // Extract payment details from request body
    const { 
      orderCreationId, 
      razorpayPaymentId, 
      razorpaySignature,
      bookingDetails 
    } = await request.json();
    
    // Verify payment signature
    const signature = generateSignature(orderCreationId, razorpayPaymentId);
    
    if (signature !== razorpaySignature) {
      return NextResponse.json(
        { message: 'Payment verification failed', isOk: false },
        { status: 400 }
      );
    }
    
    // If signature is valid, process the booking
    // In a real implementation, you would save the booking details to the database here
    console.log('Payment verified successfully', {
      orderCreationId,
      razorpayPaymentId,
      bookingDetails
    });
    
    return NextResponse.json(
      { 
        message: 'Payment verified successfully', 
        isOk: true,
        transactionId: razorpayPaymentId,
        orderId: orderCreationId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { 
        message: 'Error verifying payment', 
        isOk: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
