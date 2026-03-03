import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FeatureCard from '@/models/FeatureCard';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let query = {};
    if (type) {
      query = { type };
    }
    
    const cards = await FeatureCard.find(query).sort({ type: 1, order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      cards,
    });
  } catch (error) {
    console.error('Error fetching feature cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Set order if not provided
    if (!data.order) {
      const lastCard = await FeatureCard.findOne({ type: data.type }).sort({ order: -1 });
      data.order = lastCard ? lastCard.order + 1 : 1;
    }
    
    const card = new FeatureCard(data);
    await card.save();
    
    return NextResponse.json({
      success: true,
      card,
    });
  } catch (error) {
    console.error('Error creating feature card:', error);
    return NextResponse.json(
      { error: 'Failed to create feature card' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    const card = await FeatureCard.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!card) {
      return NextResponse.json(
        { error: 'Feature card not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      card,
    });
  } catch (error) {
    console.error('Error updating feature card:', error);
    return NextResponse.json(
      { error: 'Failed to update feature card' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }
    
    const card = await FeatureCard.findByIdAndDelete(id);
    
    if (!card) {
      return NextResponse.json(
        { error: 'Feature card not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Feature card deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting feature card:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature card' },
      { status: 500 }
    );
  }
}