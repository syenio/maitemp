import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, testR2Connection } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    // Test R2 connection first
    const connectionTest = await testR2Connection();
    if (!connectionTest.success) {
      console.error('R2 connection failed:', connectionTest.error);
      return NextResponse.json(
        { 
          error: 'R2 storage is not properly configured', 
          details: connectionTest.error 
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'maidease';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB for R2)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    console.log(`Uploading file: ${file.name} (${file.size} bytes) to folder: ${folder}`);
    
    const result = await uploadImage(file, folder) as any;

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: result.secure_url || result.url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// GET endpoint to test R2 connection
export async function GET() {
  try {
    const result = await testR2Connection();
    
    return NextResponse.json({
      status: result.success ? 'connected' : 'disconnected',
      message: result.success ? result.message : result.error,
      timestamp: new Date().toISOString(),
      ...(result.success && { objectCount: result.objectCount })
    });
  } catch (error) {
    console.error('R2 connection test error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to test R2 connection',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}