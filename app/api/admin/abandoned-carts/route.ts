import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Booking from '@/models/Booking';

// GET - Fetch abandoned carts and pending payments for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Mark abandoned carts first
    await Cart.markAbandonedCarts();
    
    // Fetch abandoned carts
    const abandonedCarts = await Cart.find({
      status: 'abandoned'
    })
    .populate('user', 'name email phone')
    .populate('items.service', 'name price category')
    .sort({ abandonedAt: -1 })
    .limit(50);
    
    // Fetch pending payment carts
    const pendingPaymentCarts = await Cart.find({
      status: 'payment_pending'
    })
    .populate('user', 'name email phone')
    .populate('items.service', 'name price category')
    .sort({ paymentInitiatedAt: -1 })
    .limit(50);
    
    // Fetch checkout initiated carts
    const checkoutInitiatedCarts = await Cart.find({
      status: 'checkout_initiated'
    })
    .populate('user', 'name email phone')
    .populate('items.service', 'name price category')
    .sort({ checkoutInitiatedAt: -1 })
    .limit(50);
    
    // Fetch related pending bookings
    const pendingBookings = await Booking.find({
      paymentStatus: 'pending',
      status: { $in: ['pending', 'payment_pending'] }
    })
    .populate('user', 'name email phone')
    .populate('service', 'name price category')
    .sort({ createdAt: -1 })
    .limit(100);
    
    // Calculate statistics
    const stats = {
      totalAbandonedCarts: abandonedCarts.length,
      totalPendingPayments: pendingPaymentCarts.length,
      totalCheckoutInitiated: checkoutInitiatedCarts.length,
      totalPendingBookings: pendingBookings.length,
      abandonedRevenue: abandonedCarts.reduce((sum, cart) => sum + cart.totalAmount, 0),
      pendingRevenue: pendingPaymentCarts.reduce((sum, cart) => sum + cart.totalAmount, 0),
      checkoutRevenue: checkoutInitiatedCarts.reduce((sum, cart) => sum + cart.totalAmount, 0),
    };
    
    return NextResponse.json({
      success: true,
      stats,
      abandonedCarts,
      pendingPaymentCarts,
      checkoutInitiatedCarts,
      pendingBookings,
    });
  } catch (error) {
    console.error('Admin abandoned carts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts data' },
      { status: 500 }
    );
  }
}