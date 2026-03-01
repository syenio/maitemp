import { NextRequest, NextResponse } from 'next/server';

// Mock PAN verification service - replace with real PAN verification API
export async function POST(request: NextRequest) {
  try {
    const { panNumber, documentUrl } = await request.json();

    if (!panNumber || !documentUrl) {
      return NextResponse.json(
        { error: 'PAN number and document are required' },
        { status: 400 }
      );
    }

    // Validate PAN format (basic validation)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
      return NextResponse.json(
        { error: 'Invalid PAN format' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP for PAN verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, integrate with PAN verification service
    // and store verification status in database
    console.log(`PAN verification initiated for: ${panNumber}`);
    console.log(`Document URL: ${documentUrl}`);
    console.log(`Verification OTP: ${otp}`);

    // Mock PAN verification - in production, call actual PAN API
    // const panVerificationResult = await panVerificationService.verify({
    //   panNumber,
    //   documentUrl
    // });

    return NextResponse.json({
      success: true,
      message: 'PAN verification initiated',
      // For demo purposes only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('PAN verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify PAN' },
      { status: 500 }
    );
  }
}