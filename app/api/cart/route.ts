import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Service from '@/models/Service';

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // In production, get user ID from JWT token
    const userId = request.headers.get('user-id') || 'demo-user-id';
    
    let cart = await Cart.findOne({ 
      user: userId, 
      status: { $in: ['active', 'checkout_initiated'] }
    }).populate('items.service');
    
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }
    
    await cart.calculateTotal();
    await cart.save();
    
    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { serviceId, scheduledDate, scheduledTime, address, specialInstructions, quantity = 1 } = await request.json();
    const userId = request.headers.get('user-id') || 'demo-user-id';
    
    if (!serviceId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Service, date, and time are required' },
        { status: 400 }
      );
    }
    
    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ 
      user: userId, 
      status: { $in: ['active', 'checkout_initiated'] }
    });
    
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }
    
    // Check if service already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.service.toString() === serviceId
    );
    
    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].scheduledDate = scheduledDate;
      cart.items[existingItemIndex].scheduledTime = scheduledTime;
      cart.items[existingItemIndex].address = address;
      cart.items[existingItemIndex].specialInstructions = specialInstructions;
    } else {
      // Add new item
      cart.items.push({
        service: serviceId,
        quantity,
        scheduledDate,
        scheduledTime,
        address,
        specialInstructions,
      });
    }
    
    cart.status = 'active';
    await cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.service');
    
    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const userId = request.headers.get('user-id') || 'demo-user-id';
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    const cart = await Cart.findOne({ 
      user: userId, 
      status: { $in: ['active', 'checkout_initiated'] }
    });
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    await cart.calculateTotal();
    await cart.save();
    
    await cart.populate('items.service');
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}