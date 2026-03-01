import { NextRequest, NextResponse } from 'next/server';

// Mock SMS service - replace with real SMS service like Twilio, AWS SNS, etc.
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, store OTP in database with expiry time
    const otpStore = new Map();
    otpStore.set(phone, {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Mock SMS sending - replace with real SMS service
    console.log(`Sending OTP ${otp} to phone: ${phone}`);
    
    // In production, send actual SMS here
    // await smsService.send({
    //   to: phone,
    //   message: `Your Maids for Care verification OTP is: ${otp}`
    // });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // For demo purposes only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Phone OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}