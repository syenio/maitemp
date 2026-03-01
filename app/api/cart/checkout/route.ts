import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Booking from '@/models/Booking';

// POST - Initiate checkout process
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = request.headers.get('user-id') || 'demo-user-id';
    
    const cart = await Cart.findOne({ 
      user: userId, 
      status: 'active'
    }).populate('items.service');
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Mark cart as checkout initiated
    cart.status = 'checkout_initiated';
    cart.checkoutInitiatedAt = new Date();
    await cart.save();
    
    // Create pending bookings for each cart item
    const bookings = [];
    
    for (const item of cart.items) {
      const booking = await Booking.create({
        user: userId,
        service: item.service._id,
        scheduledDate: item.scheduledDate,
        scheduledTime: item.scheduledTime,
        totalAmount: item.service.price * item.quantity,
        status: 'pending',
        paymentStatus: 'pending',
        address: item.address,
        specialInstructions: item.specialInstructions,
        quantity: item.quantity,
        cartId: cart._id,
      });
      
      bookings.push(booking);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Checkout initiated',
      cart,
      bookings,
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    console.error('Checkout initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate checkout' },
      { status: 500 }
    );
  }
}