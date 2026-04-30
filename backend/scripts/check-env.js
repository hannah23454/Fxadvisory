#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * Run this script to verify your .env.local setup
 * Usage: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const requiredVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

console.log('🔍 Checking environment configuration...\n');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: .env.local file not found!');
  console.log('\n📝 To fix this:');
  console.log('1. Copy .env.example to .env.local:');
  console.log('   cp .env.example .env.local');
  console.log('2. Update the values in .env.local');
  console.log('3. See ENV_SETUP.md for detailed instructions');
  process.exit(1);
}

console.log('✅ .env.local file found\n');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// Check required variables
let hasErrors = false;

requiredVars.forEach(varName => {
  if (!envVars[varName]) {
    console.error(`❌ ERROR: ${varName} is not set`);
    hasErrors = true;
  } else if (envVars[varName].includes('your-') || envVars[varName].includes('your_')) {
    console.error(`⚠️  WARNING: ${varName} appears to be a placeholder value`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName} is set`);
  }
});

// Specific checks
if (envVars['NEXTAUTH_SECRET'] && envVars['NEXTAUTH_SECRET'].length < 32) {
  console.error('❌ ERROR: NEXTAUTH_SECRET is too short (minimum 32 characters)');
  console.log('   Generate a secure secret with: openssl rand -base64 32');
  hasErrors = true;
}

if (envVars['NEXTAUTH_URL'] && envVars['NEXTAUTH_URL'].endsWith('/')) {
  console.error('⚠️  WARNING: NEXTAUTH_URL should not have a trailing slash');
  hasErrors = true;
}

if (envVars['NEXTAUTH_URL'] && !envVars['NEXTAUTH_URL'].startsWith('http')) {
  console.error('❌ ERROR: NEXTAUTH_URL must start with http:// or https://');
  hasErrors = true;
}

console.log('');

if (hasErrors) {
  console.error('❌ Configuration has errors!');
  console.log('\n📖 Please see ENV_SETUP.md for detailed setup instructions');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are properly configured!');
  console.log('\n🚀 You can now start the development server:');
  console.log('   npm run dev');
  console.log('   or');
  console.log('   pnpm dev');
  process.exit(0);
}
