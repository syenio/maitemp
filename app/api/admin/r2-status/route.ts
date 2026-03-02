import { NextResponse } from 'next/server';
import { testR2Connection } from '@/lib/r2';

export async function GET() {
  try {
    // Check environment variables
    const requiredVars = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
    const envStatus = requiredVars.map(varName => ({
      name: varName,
      configured: !!process.env[varName],
      value: process.env[varName] ? 
        (varName.includes('SECRET') ? '***HIDDEN***' : process.env[varName]) : 
        'NOT SET'
    }));

    // Test R2 connection
    const connectionTest = await testR2Connection();

    // Validate endpoint format
    const endpoint = process.env.R2_ENDPOINT;
    const endpointValid = endpoint ? 
      endpoint.startsWith('https://') && endpoint.includes('.r2.cloudflarestorage.com') :
      false;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        variables: envStatus,
        allConfigured: envStatus.every(v => v.configured),
        endpointValid
      },
      connection: {
        status: connectionTest.success ? 'connected' : 'failed',
        message: connectionTest.success ? connectionTest.message : connectionTest.error,
        ...(connectionTest.success && { objectCount: connectionTest.objectCount })
      },
      recommendations: generateRecommendations(envStatus, endpointValid, connectionTest)
    });
  } catch (error) {
    console.error('R2 status check error:', error);
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: 'Failed to check R2 status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(envStatus: any[], endpointValid: boolean, connectionTest: any): string[] {
  const recommendations: string[] = [];

  // Check missing environment variables
  const missing = envStatus.filter(v => !v.configured);
  if (missing.length > 0) {
    recommendations.push(`Configure missing environment variables: ${missing.map(v => v.name).join(', ')}`);
  }

  // Check endpoint format
  if (!endpointValid) {
    recommendations.push('R2_ENDPOINT should follow format: https://your-account-id.r2.cloudflarestorage.com');
  }

  // Connection-specific recommendations
  if (!connectionTest.success) {
    const error = connectionTest.error.toLowerCase();
    
    if (error.includes('ssl') || error.includes('handshake')) {
      recommendations.push('SSL/TLS error: Verify your R2 endpoint URL is correct');
      recommendations.push('Check if your network/firewall allows HTTPS connections to Cloudflare');
    }
    
    if (error.includes('credentials') || error.includes('access')) {
      recommendations.push('Invalid credentials: Verify your R2 Access Key ID and Secret Access Key');
      recommendations.push('Ensure your API token has Object:Edit and Object:Read permissions');
    }
    
    if (error.includes('bucket') || error.includes('nosuchbucket')) {
      recommendations.push('Bucket not found: Verify the bucket name exists in your Cloudflare account');
      recommendations.push('Check that your API token has access to this specific bucket');
    }
  }

  // General recommendations
  if (recommendations.length === 0 && connectionTest.success) {
    recommendations.push('R2 is properly configured and connected!');
  } else if (recommendations.length === 0) {
    recommendations.push('Check the Cloudflare R2 documentation for troubleshooting');
    recommendations.push('Verify your Cloudflare account has R2 enabled');
  }

  return recommendations;
}