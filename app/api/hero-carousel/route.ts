import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroCarousel from '@/models/HeroCarousel';

// GET - Fetch active carousel slides for public display
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const slides = await HeroCarousel.getActiveSlides();
    
    return NextResponse.json({
      success: true,
      slides,
    });
  } catch (error) {
    console.error('Hero carousel public fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carousel slides' },
      { status: 500 }
    );
  }
}

// POST - Track slide view/click
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { slideId, action } = await request.json();
    
    if (!slideId || !action) {
      return NextResponse.json(
        { error: 'Slide ID and action are required' },
        { status: 400 }
      );
    }
    
    const updateField = action === 'view' ? 'viewCount' : 'clickCount';
    
    await HeroCarousel.findByIdAndUpdate(
      slideId,
      { $inc: { [updateField]: 1 } }
    );
    
    return NextResponse.json({
      success: true,
      message: `${action} tracked successfully`,
    });
  } catch (error) {
    console.error('Hero carousel tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track carousel interaction' },
      { status: 500 }
    );
  }
}