# Cloudflare R2 Integration for MaidEase

This document explains the Cloudflare R2 integration in the MaidEase application, including setup, configuration, and troubleshooting.

## Overview

MaidEase uses Cloudflare R2 for storing and serving uploaded files, including:
- Hero carousel images
- Service provider profile images
- Document uploads (PAN card, Aadhar, etc.)
- User profile pictures

## Quick Setup

### Option 1: Interactive Setup Script
```bash
npm run setup-r2
```

### Option 2: Manual Configuration
1. Copy environment variables from `.env.example`
2. Replace placeholder values with your R2 credentials
3. Restart the development server

## Environment Variables

```env
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=maidease-uploads
R2_PUBLIC_URL=
```

### Variable Details

- **R2_ENDPOINT**: Your account-specific R2 endpoint
- **R2_ACCESS_KEY_ID**: API token access key
- **R2_SECRET_ACCESS_KEY**: API token secret key
- **R2_BUCKET_NAME**: Name of your R2 bucket
- **R2_PUBLIC_URL**: (Optional) Custom domain for public access

## File Structure

```
lib/
├── r2.ts                 # R2 client and upload functions
└── README-colors.md      # Color system documentation

app/api/
├── upload/route.ts       # File upload endpoint
└── admin/r2-status/      # R2 status checker endpoint

components/
└── FileUpload.tsx        # File upload component

docs/
├── R2_SETUP_GUIDE.md     # Detailed setup instructions
└── R2_INTEGRATION.md     # This file

scripts/
└── setup-r2.js          # Interactive setup script
```

## Key Features

### 1. Upload Function (`lib/r2.ts`)
- Validates file size and type
- Generates unique filenames
- Handles errors with specific messages
- Returns Cloudinary-compatible response format

### 2. Connection Testing
- Validates environment variables
- Tests R2 connectivity
- Provides detailed error messages
- Available at `/api/admin/r2-status`

### 3. Admin Dashboard Integration
- System Status tab shows R2 health
- Configuration checker
- Test upload functionality
- Real-time status updates

### 4. Error Handling
- SSL/TLS handshake failures
- Invalid credentials
- Bucket not found
- Network timeouts

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File to upload
- folder: (optional) Folder name
```

### Check R2 Status
```
GET /api/admin/r2-status

Response:
{
  "environment": { ... },
  "connection": { ... },
  "recommendations": [ ... ]
}
```

### Test Upload
```
GET /api/upload

Response:
{
  "status": "connected|disconnected",
  "message": "...",
  "timestamp": "..."
}
```

## Usage Examples

### Basic Upload
```typescript
import { uploadImage } from '@/lib/r2';

const file = // File object
const result = await uploadImage(file, 'profile-images');
console.log(result.secure_url); // Public URL
```

### Using FileUpload Component
```tsx
import { FileUpload } from '@/components/FileUpload';

<FileUpload
  onUpload={(url) => console.log('Uploaded:', url)}
  folder="carousel"
  maxSize={10}
  accept="image/*"
/>
```

### Testing Connection
```typescript
import { testR2Connection } from '@/lib/r2';

const status = await testR2Connection();
if (status.success) {
  console.log('R2 is connected');
} else {
  console.error('R2 error:', status.error);
}
```

## Troubleshooting

### Common Issues

#### 1. SSL/TLS Handshake Failure
```
Error: write EPROTO ... SSL routines:ssl3_read_bytes:ssl/tls alert handshake failure
```

**Solutions:**
- Verify endpoint URL format
- Check network/firewall settings
- Ensure R2 service is accessible

#### 2. Invalid Credentials
```
Error: The AWS Access Key Id you provided does not exist in our records
```

**Solutions:**
- Verify Access Key ID and Secret Access Key
- Check API token permissions
- Regenerate API token if needed

#### 3. Bucket Not Found
```
Error: The specified bucket does not exist
```

**Solutions:**
- Verify bucket name spelling
- Check bucket exists in your account
- Ensure API token has bucket access

### Debugging Steps

1. **Check Environment Variables**
   ```bash
   # Verify all R2 variables are set
   node -e "console.log(process.env.R2_ENDPOINT)"
   ```

2. **Test Connection**
   ```bash
   # Visit admin panel System Status tab
   # Or call API directly
   curl http://localhost:3000/api/admin/r2-status
   ```

3. **Check Logs**
   ```bash
   # Look for R2-related errors in console
   npm run dev
   ```

4. **Test Upload**
   ```bash
   # Use admin panel test upload feature
   # Or test via API
   curl -X POST -F "file=@test.jpg" http://localhost:3000/api/upload
   ```

## Security Considerations

1. **Environment Variables**: Never commit `.env` to version control
2. **API Token Permissions**: Use minimal required permissions
3. **Token Rotation**: Regularly rotate API tokens
4. **Access Logs**: Monitor R2 access logs
5. **File Validation**: Always validate file types and sizes

## Performance Optimization

1. **File Size Limits**: Set appropriate limits (10MB default)
2. **Image Optimization**: Consider image compression
3. **CDN**: Use R2's built-in CDN capabilities
4. **Caching**: Implement proper cache headers

## Cost Management

1. **Storage**: Monitor storage usage in Cloudflare dashboard
2. **Requests**: Track API request counts
3. **Data Transfer**: Monitor egress costs
4. **Cleanup**: Implement file cleanup for unused uploads

## Migration from Cloudinary

If migrating from Cloudinary:

1. Update environment variables
2. The upload response format is compatible
3. Update any Cloudinary-specific transformations
4. Test all upload functionality

## Support

For issues with R2 integration:

1. Check this documentation
2. Review the setup guide: `docs/R2_SETUP_GUIDE.md`
3. Use the admin panel System Status tab
4. Check Cloudflare R2 documentation
5. Contact Cloudflare support for account issues