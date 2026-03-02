import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroCarousel from '@/models/HeroCarousel';

// GET - Fetch single carousel slide
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const slide = await HeroCarousel.findById(params.id);
    
    if (!slide) {
      return NextResponse.json(
        { error: 'Carousel slide not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      slide,
    });
  } catch (error) {
    console.error('Hero carousel fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carousel slide' },
      { status: 500 }
    );
  }
}

// PUT - Update carousel slide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const updateData = await request.json();
    
    const slide = await HeroCarousel.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!slide) {
      return NextResponse.json(
        { error: 'Carousel slide not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Carousel slide updated successfully',
      slide,
    });
  } catch (error) {
    console.error('Hero carousel update error:', error);
    return NextResponse.json(
      { error: 'Failed to update carousel slide' },
      { status: 500 }
    );
  }
}

// DELETE - Delete carousel slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const slide = await HeroCarousel.findByIdAndDelete(params.id);
    
    if (!slide) {
      return NextResponse.json(
        { error: 'Carousel slide not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Carousel slide deleted successfully',
    });
  } catch (error) {
    console.error('Hero carousel deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete carousel slide' },
      { status: 500 }
    );
  }
}