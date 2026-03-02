import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Validate R2 configuration on module load
const validateR2Config = () => {
  const required = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing R2 configuration: ${missing.join(', ')}`);
    return false;
  }
  
  // Validate endpoint format
  const endpoint = process.env.R2_ENDPOINT!;
  if (!endpoint.startsWith('https://') || !endpoint.includes('.r2.cloudflarestorage.com')) {
    console.warn('Invalid R2_ENDPOINT format. Should be: https://your-account-id.r2.cloudflarestorage.com');
    return false;
  }
  
  return true;
};

const isConfigValid = validateR2Config();

const r2Client = isConfigValid ? new S3Client({
  region: 'auto', // R2 uses 'auto' region
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for R2 compatibility
  // Enhanced SSL/TLS configuration
  requestHandler: {
    requestTimeout: 30000, // 30 seconds
    httpsAgent: {
      keepAlive: true,
      maxSockets: 50,
      // Force TLS 1.2 or higher
      secureProtocol: 'TLSv1_2_method',
    },
  },
}) : null;

export async function uploadImage(file: File, folder: string = 'maidease') {
  try {
    // Check if R2 is properly configured
    if (!isConfigValid || !r2Client) {
      throw new Error('R2 is not properly configured. Please check your environment variables.');
    }

    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }

    // Check file size (max 10MB for R2)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Maximum 10MB allowed.');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate a unique filename with better sanitization
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    const fileName = `${sanitizedFolder}/${timestamp}-${randomString}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
      ContentLength: buffer.length,
      Metadata: {
        'original-name': file.name,
        'upload-timestamp': timestamp.toString(),
        'file-size': file.size.toString(),
      },
    });

    console.log(`Uploading to R2: ${fileName} (${buffer.length} bytes)`);
    await r2Client.send(command);

    // Construct the public URL
    const publicUrl = process.env.R2_PUBLIC_URL 
      ? `${process.env.R2_PUBLIC_URL}/${fileName}`
      : `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`;

    console.log(`Upload successful: ${publicUrl}`);

    // Return object similar to Cloudinary response for compatibility
    return {
      public_id: fileName,
      secure_url: publicUrl,
      url: publicUrl,
      resource_type: file.type.startsWith('image/') ? 'image' : 'raw',
      format: fileExtension,
      bytes: buffer.length,
      original_filename: file.name,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('EPROTO') || error.message.includes('SSL') || error.message.includes('handshake')) {
        throw new Error('SSL/TLS connection failed. Please verify your R2 endpoint URL and credentials.');
      }
      if (error.message.includes('credentials') || error.message.includes('access')) {
        throw new Error('Invalid R2 credentials. Please check your access keys in the environment variables.');
      }
      if (error.message.includes('bucket') || error.message.includes('NoSuchBucket')) {
        throw new Error('R2 bucket not found. Please verify the bucket name exists.');
      }
      if (error.message.includes('timeout')) {
        throw new Error('Upload timeout. Please try again or check your internet connection.');
      }
    }
    
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteImage(publicId: string) {
  try {
    if (!isConfigValid || !r2Client) {
      throw new Error('R2 is not properly configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: publicId,
    });

    await r2Client.send(command);
    return { result: 'ok' };
  } catch (error) {
    console.error('R2 delete error:', error);
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getSignedUploadUrl(fileName: string, contentType: string, folder: string = 'maidease') {
  try {
    if (!isConfigValid || !r2Client) {
      throw new Error('R2 is not properly configured');
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    const key = `${sanitizedFolder}/${timestamp}-${randomString}.${fileExtension}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    
    const publicUrl = process.env.R2_PUBLIC_URL 
      ? `${process.env.R2_PUBLIC_URL}/${key}`
      : `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`;
    
    return {
      signedUrl,
      key,
      publicUrl,
    };
  } catch (error) {
    console.error('R2 signed URL error:', error);
    throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Test R2 connection
export async function testR2Connection() {
  try {
    if (!isConfigValid || !r2Client) {
      return { 
        success: false, 
        error: 'R2 configuration is invalid or missing. Please check your environment variables.' 
      };
    }

    console.log('Testing R2 connection...');
    
    // Try to list objects (this will test the connection without uploading)
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      MaxKeys: 1,
    });

    const result = await r2Client.send(command);
    console.log('R2 connection test successful:', result.KeyCount || 0, 'objects found');
    
    return { 
      success: true, 
      message: `R2 connection successful. Bucket: ${process.env.R2_BUCKET_NAME}`,
      objectCount: result.KeyCount || 0
    };
  } catch (error) {
    console.error('R2 connection test failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.message.includes('EPROTO') || error.message.includes('SSL')) {
        errorMessage = 'SSL/TLS handshake failed. Check your R2 endpoint URL.';
      } else if (error.message.includes('credentials') || error.message.includes('access')) {
        errorMessage = 'Invalid credentials. Check your R2 access keys.';
      } else if (error.message.includes('bucket') || error.message.includes('NoSuchBucket')) {
        errorMessage = 'Bucket not found. Verify the bucket name and permissions.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export default r2Client;