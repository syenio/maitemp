import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Booking from '@/models/Booking';

// POST - Initiate payment (user reaches payment page)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = request.headers.get('user-id') || 'demo-user-id';
    
    const cart = await Cart.findOne({ 
      user: userId, 
      status: 'checkout_initiated'
    });
    
    if (!cart) {
      return NextResponse.json(
        { error: 'No active checkout found' },
        { status: 400 }
      );
    }
    
    // Mark cart as payment pending
    cart.status = 'payment_pending';
    cart.paymentInitiatedAt = new Date();
    await cart.save();
    
    // Update related bookings
    await Booking.updateMany(
      { cartId: cart._id },
      { 
        status: 'payment_pending',
        paymentStatus: 'pending'
      }
    );
    
    // In production, create Razorpay order here
    const mockPaymentOrder = {
      orderId: `order_${Date.now()}`,
      amount: cart.totalAmount,
      currency: 'INR',
    };
    
    return NextResponse.json({
      success: true,
      message: 'Payment initiated',
      cart,
      paymentOrder: mockPaymentOrder,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}