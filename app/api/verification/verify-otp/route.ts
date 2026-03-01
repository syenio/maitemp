import { NextRequest, NextResponse } from 'next/server';

// Mock OTP verification - replace with real verification logic
export async function POST(request: NextRequest) {
  try {
    const { type, otp, email, phone, panNumber } = await request.json();

    if (!type || !otp) {
      return NextResponse.json(
        { error: 'Type and OTP are required' },
        { status: 400 }
      );
    }

    // For demo purposes, accept "123456" as valid OTP
    // In production, verify against stored OTP in database
    const isValidOTP = otp === '123456';

    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // In production, update verification status in database
    console.log(`${type.toUpperCase()} verification successful for:`, {
      email: type === 'email' ? email : undefined,
      phone: type === 'phone' ? phone : undefined,
      panNumber: type === 'pan' ? panNumber : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `${type.toUpperCase()} verified successfully`,
      verified: true,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}