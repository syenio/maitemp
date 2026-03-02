#!/usr/bin/env node

/**
 * R2 Configuration Setup Script
 * 
 * This script helps configure Cloudflare R2 for the MaidEase application.
 * Run with: node scripts/setup-r2.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🚀 MaidEase R2 Configuration Setup\n');
  console.log('This script will help you configure Cloudflare R2 for file uploads.\n');
  
  console.log('Before proceeding, make sure you have:');
  console.log('1. A Cloudflare account with R2 enabled');
  console.log('2. Created an R2 bucket');
  console.log('3. Generated R2 API tokens with Object:Edit and Object:Read permissions\n');
  
  const proceed = await question('Do you want to continue? (y/N): ');
  if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  console.log('\nPlease provide your R2 configuration details:\n');

  // Collect R2 configuration
  const endpoint = await question('R2 Endpoint URL (https://your-account-id.r2.cloudflarestorage.com): ');
  const accessKeyId = await question('R2 Access Key ID: ');
  const secretAccessKey = await question('R2 Secret Access Key: ');
  const bucketName = await question('R2 Bucket Name: ');
  const publicUrl = await question('R2 Public URL (optional, press Enter to skip): ');

  // Validate inputs
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    console.log('\n❌ Error: All required fields must be provided.');
    rl.close();
    return;
  }

  if (!endpoint.startsWith('https://') || !endpoint.includes('.r2.cloudflarestorage.com')) {
    console.log('\n❌ Error: Invalid endpoint format. Should be: https://your-account-id.r2.cloudflarestorage.com');
    rl.close();
    return;
  }

  // Read existing .env file
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add R2 configuration
  const r2Config = `
# Cloudflare R2 Configuration
R2_ENDPOINT=${endpoint}
R2_ACCESS_KEY_ID=${accessKeyId}
R2_SECRET_ACCESS_KEY=${secretAccessKey}
R2_BUCKET_NAME=${bucketName}
R2_PUBLIC_URL=${publicUrl}
`;

  // Remove existing R2 configuration if present
  envContent = envContent.replace(/# Cloudflare R2 Configuration[\s\S]*?(?=\n#|\n[A-Z]|$)/g, '');
  
  // Add new R2 configuration
  envContent += r2Config;

  // Write updated .env file
  fs.writeFileSync(envPath, envContent.trim() + '\n');

  console.log('\n✅ R2 configuration has been saved to .env file');
  console.log('\nNext steps:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Visit http://localhost:3000/admin and go to "System Status" tab');
  console.log('3. Check the R2 connection status');
  console.log('4. Test file upload functionality');
  console.log('\nIf you encounter issues, check the R2 Setup Guide: docs/R2_SETUP_GUIDE.md');

  rl.close();
}

main().catch((error) => {
  console.error('\n❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});