# Cloudflare R2 Setup Guide for MaidEase

This guide will help you configure Cloudflare R2 storage for the MaidEase application.

## Prerequisites

1. A Cloudflare account
2. Access to Cloudflare R2 (may require payment method on file)

## Step 1: Create R2 Bucket

1. Log in to your Cloudflare dashboard
2. Navigate to **R2 Object Storage** in the sidebar
3. Click **Create bucket**
4. Choose a bucket name (e.g., `maidease-uploads`)
5. Select a location (choose closest to your users)
6. Click **Create bucket**

## Step 2: Generate API Tokens

1. In the R2 dashboard, click **Manage R2 API tokens**
2. Click **Create API token**
3. Configure the token:
   - **Token name**: `MaidEase Upload Token`
   - **Permissions**: 
     - `Object:Edit` (for uploads)
     - `Object:Read` (for downloads)
   - **Account resources**: Include your account
   - **Bucket resources**: Include your bucket
4. Click **Continue to summary**
5. Click **Create API token**
6. **IMPORTANT**: Copy and save the token details:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (format: `https://your-account-id.r2.cloudflarestorage.com`)

## Step 3: Configure Environment Variables

Update your `.env` file with the R2 credentials:

```env
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=maidease-uploads
R2_PUBLIC_URL=
```

### Environment Variable Details:

- **R2_ENDPOINT**: Your account-specific R2 endpoint URL
- **R2_ACCESS_KEY_ID**: The Access Key ID from your API token
- **R2_SECRET_ACCESS_KEY**: The Secret Access Key from your API token
- **R2_BUCKET_NAME**: The name of your R2 bucket
- **R2_PUBLIC_URL**: (Optional) Custom domain for public access

## Step 4: Test the Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the R2 connection by visiting:
   ```
   http://localhost:3000/api/upload
   ```
   
   This should return a JSON response with connection status.

3. Test file upload by using any file upload feature in the admin panel.

## Step 5: Configure Public Access (Optional)

If you want to serve images directly from R2:

1. In your R2 bucket settings, go to **Settings**
2. Under **Public access**, click **Allow Access**
3. Configure a custom domain if desired
4. Update `R2_PUBLIC_URL` in your `.env` file

## Troubleshooting

### SSL/TLS Handshake Failure

If you see errors like "SSL routines:ssl3_read_bytes:ssl/tls alert handshake failure":

1. **Check endpoint URL**: Ensure it follows the format `https://your-account-id.r2.cloudflarestorage.com`
2. **Verify credentials**: Double-check your Access Key ID and Secret Access Key
3. **Check bucket name**: Ensure the bucket exists and is spelled correctly
4. **Network issues**: Try from a different network or check firewall settings

### Access Denied Errors

1. **Token permissions**: Ensure your API token has `Object:Edit` and `Object:Read` permissions
2. **Bucket access**: Verify the token has access to your specific bucket
3. **Account access**: Ensure the token has access to your Cloudflare account

### Bucket Not Found

1. **Bucket name**: Verify the bucket name is correct and exists
2. **Region**: Ensure you're using the correct endpoint for your bucket's region

## Security Best Practices

1. **Environment variables**: Never commit your `.env` file to version control
2. **Token permissions**: Use minimal required permissions for API tokens
3. **Token rotation**: Regularly rotate your API tokens
4. **Access logs**: Monitor R2 access logs for unusual activity

## Cost Considerations

- R2 charges for storage, requests, and data transfer
- First 10GB of storage per month is free
- Monitor usage in the Cloudflare dashboard

## Support

If you continue to have issues:

1. Check the Cloudflare R2 documentation
2. Verify your account has R2 enabled
3. Contact Cloudflare support for account-specific issues