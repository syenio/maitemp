import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImage(file: File, folder: string = 'maids-for-care') {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    const key = fileName.replace(/\s+/g, '-').toLowerCase();

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // Return object similar to Cloudinary response for compatibility
    return {
      public_id: key,
      secure_url: `${process.env.R2_PUBLIC_URL}/${key}`,
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
      resource_type: file.type.startsWith('image/') ? 'image' : 'raw',
      format: file.name.split('.').pop(),
      bytes: buffer.length,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(publicId: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: publicId,
    });

    const result = await r2Client.send(command);
    return { result: 'ok' };
  } catch (error) {
    console.error('R2 delete error:', error);
    throw new Error('Failed to delete image');
  }
}

export async function getSignedUploadUrl(fileName: string, contentType: string, folder: string = 'maids-for-care') {
  try {
    const key = `${folder}/${Date.now()}-${fileName}`.replace(/\s+/g, '-').toLowerCase();
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    
    return {
      signedUrl,
      key,
      publicUrl: `${process.env.R2_PUBLIC_URL}/${key}`,
    };
  } catch (error) {
    console.error('R2 signed URL error:', error);
    throw new Error('Failed to generate signed URL');
  }
}

export default r2Client;