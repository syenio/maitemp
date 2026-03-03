import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FeatureCard from '@/models/FeatureCard';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    interface QueryFilter {
      isActive: boolean;
      type?: string;
    }
    
    const query: QueryFilter = { isActive: true };
    if (type) {
      query.type = type;
    }
    
    const cards = await FeatureCard.find(query).sort({ order: 1, createdAt: -1 });
    
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