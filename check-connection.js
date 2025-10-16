#!/usr/bin/env node

/**
 * Quick Supabase Connection Test Script
 * Run this script to quickly check your local environment setup
 */

const { execSync } = require('child_process');

console.log('🔧 Testing Supabase Connection Setup...\n');

// Check if we're in the correct directory
const packagePath = './package.json';
try {
  require(packagePath);
} catch (error) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Check Next.js environment variables
console.log('📋 Environment Variables Check:\n');
const nextEnvPath = '.next';
let nextEnvContent = '';

try {
  nextEnvContent = require('fs').readFileSync('./.next', 'utf8');
} catch (error) {
  nextEnvContent = '';
}

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let allVarsSet = true;
requiredVars.forEach(varName => {
  const value = process.env[varName] ? '✅ Set' : '❌ Missing';
  console.log(`  ${moduleName}: ${value}`);

  if (!process.env[varName]) {
    allVarsSet = false;
  }
});

if (!allVarsSet) {
  console.log('\n❌ Some environment variables are missing! Please update your .env file.\n');
  console.log('Current .env status:');
  console.log('  ' + nextEnvContent.slice(0, 500) + (nextEnvContent.length > 500 ? '...' : ''));
  process.exit(1);
}

console.log('\n✅ All required environment variables are set!\n');

// Test Next.js build to ensure no import/export errors
console.log('🔨 Testing Next.js build...');
try {
  const buildResult = execSync('npm run build --no-lint', { encoding: 'utf8', stdio: 'pipe' });
  if (buildResult.stderr) {
    console.log('⚠️ Build warnings/errors found, but build completed');
  } else {
    console.log('✅ Next.js build successful!');
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Summary:');
console.log('✅ You can now:');
console.log('   • Test your connection: npm run dev');
console.log('  • Visit /supabase-debug for detailed status');
console.log('  • Configure your actual Supabase credentials');
console.log('\n📚� Next Steps:');
console.log('   1. Replace placeholder values in .env with your actual keys');
console.log('   2. Create database tables in Supabase');
console.log('   3. Start developing!');

console.log('\n🔗 Supabase Setup Guide:');
console.log('  • Create project: https://supabase.com');
console.log('  • Get keys: Project Settings → API');
console.log('  • Run SQL: lib/supabase/schema.sql');
console.log('  • Update .env with your actual values');
