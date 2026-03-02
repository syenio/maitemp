import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HeroCarousel from '@/models/HeroCarousel';

// GET - Fetch all carousel slides for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const slides = await HeroCarousel.find({})
      .sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      slides,
    });
  } catch (error) {
    console.error('Hero carousel fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carousel slides' },
      { status: 500 }
    );
  }
}

// POST - Create new carousel slide
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const slideData = await request.json();
    
    // Validate required fields
    if (!slideData.title || !slideData.imageUrl) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }
    
    // If no order specified, set as last
    if (!slideData.order) {
      const lastSlide = await HeroCarousel.findOne({}).sort({ order: -1 });
      slideData.order = lastSlide ? lastSlide.order + 1 : 1;
    }
    
    const slide = await HeroCarousel.create(slideData);
    
    return NextResponse.json({
      success: true,
      message: 'Carousel slide created successfully',
      slide,
    }, { status: 201 });
  } catch (error) {
    console.error('Hero carousel creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create carousel slide' },
      { status: 500 }
    );
  }
}

// PUT - Update carousel slide order
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const { slides } = await request.json();
    
    if (!Array.isArray(slides)) {
      return NextResponse.json(
        { error: 'Slides array is required' },
        { status: 400 }
      );
    }
    
    // Update order for each slide
    const updatePromises = slides.map((slide, index) => 
      HeroCarousel.findByIdAndUpdate(slide._id, { order: index + 1 })
    );
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({
      success: true,
      message: 'Slide order updated successfully',
    });
  } catch (error) {
    console.error('Hero carousel order update error:', error);
    return NextResponse.json(
      { error: 'Failed to update slide order' },
      { status: 500 }
    );
  }
}