import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ServiceProvider from '@/models/ServiceProvider';
import crypto from 'crypto';

// QR Code generation function
function generateQRCodeDataURL(data: string): string {
  // For demo purposes, return a simple SVG QR code
  // In production, use a proper QR code library like 'qrcode'
  const qrSvg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#000"/>
      <rect x="10" y="10" width="180" height="180" fill="#fff"/>
      <text x="100" y="100" font-family="Arial" font-size="12" fill="#000" text-anchor="middle">
        ${data.substring(0, 16)}
      </text>
      <text x="100" y="120" font-family="Arial" font-size="10" fill="#000" text-anchor="middle">
        QR Code
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(qrSvg).toString('base64')}`;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingProvider = await ServiceProvider.findOne({ email: formData.email });
    if (existingProvider) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate unique provider ID
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const providerId = `MP${timestamp}${randomStr}`.toUpperCase();
    
    // Generate SHA256 hash for QR code
    const qrData = `${providerId}-${formData.email}-${timestamp}`;
    const qrHash = crypto.createHash('sha256').update(qrData).digest('hex');
    const qrCodeImage = generateQRCodeDataURL(qrData);

    // Create service provider with enhanced verification data
    const serviceProvider = await ServiceProvider.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      experience: formData.experience || 0,
      bio: formData.bio || '',
      
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      bankDetails: formData.bankDetails,
      
      // Enhanced verification system
      verification: {
        email: {
          isVerified: formData.verification?.email?.isVerified || false,
          verifiedAt: formData.verification?.email?.isVerified ? new Date() : undefined,
        },
        phone: {
          isVerified: formData.verification?.phone?.isVerified || false,
          verifiedAt: formData.verification?.phone?.isVerified ? new Date() : undefined,
        },
        panCard: {
          number: formData.panCardNumber,
          isVerified: formData.verification?.panCard?.isVerified || false,
          documentUrl: formData.documents?.panCardImage,
          verifiedAt: formData.verification?.panCard?.isVerified ? new Date() : undefined,
        },
        aadhar: {
          number: formData.aadharNumber,
          documentUrl: formData.documents?.aadharImage,
        },
      },
      
      // Provider ID and QR code
      providerId,
      qrCode: {
        hash: qrHash,
        imageUrl: qrCodeImage,
        generatedAt: new Date(),
      },
      
      // Documents
      documents: {
        profileImage: formData.documents?.profileImage,
        panCardImage: formData.documents?.panCardImage,
        aadharImage: formData.documents?.aadharImage,
        idProof: formData.documents?.idProof,
        addressProof: formData.documents?.addressProof,
        experienceCertificate: formData.documents?.experienceCertificate,
      },
      
      // Set verification status based on completed verifications
      isVerified: formData.verification?.email?.isVerified && 
                  formData.verification?.phone?.isVerified && 
                  formData.verification?.panCard?.isVerified,
      
      // Default availability
      availability: formData.availability || {
        monday: { start: '09:00', end: '18:00', available: true },
        tuesday: { start: '09:00', end: '18:00', available: true },
        wednesday: { start: '09:00', end: '18:00', available: true },
        thursday: { start: '09:00', end: '18:00', available: true },
        friday: { start: '09:00', end: '18:00', available: true },
        saturday: { start: '09:00', end: '18:00', available: true },
        sunday: { start: '09:00', end: '18:00', available: false },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Service provider registered successfully',
      providerId: serviceProvider.providerId,
      qrCode: qrCodeImage,
      provider: {
        id: serviceProvider._id,
        name: serviceProvider.name,
        email: serviceProvider.email,
        providerId: serviceProvider.providerId,
        isVerified: serviceProvider.isVerified,
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error('Service provider registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register service provider' },
      { status: 500 }
    );
  }
}