import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Mock email service - replace with real email service like SendGrid, Nodemailer, etc.
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, store OTP in database with expiry time
    // For demo, we'll use a simple in-memory store
    const otpStore = new Map();
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Mock email sending - replace with real email service
    console.log(`Sending OTP ${otp} to email: ${email}`);
    
    // In production, send actual email here
    // await emailService.send({
    //   to: email,
    //   subject: 'Maids for Care - Email Verification OTP',
    //   html: `Your verification OTP is: <strong>${otp}</strong>`
    // });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // For demo purposes only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Email OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}