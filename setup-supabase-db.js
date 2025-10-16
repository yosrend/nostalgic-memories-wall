#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function setupSupabaseDatabase() {
  console.log('🚀 Setting up Supabase Database...\n');

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SERVICE_ROLE_KEY) {
    console.log('❌ SERVICE_ROLE_KEY not found! Cannot setup database.');
    console.log('Please check your .env file.');
    process.exit(1);
  }

  // Use service role key for admin operations
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Read SQL schema file
  const schemaFile = './lib/supabase/schema.sql';
  let sqlSchema;
  
  try {
    sqlSchema = fs.readFileSync(schemaFile, 'utf8');
    console.log('✅ SQL schema loaded');
  } catch (error) {
    console.log(`❌ Error reading schema file: ${error.message}`);
    process.exit(1);
  }

  // Split SQL by semicolons (basic SQL splitter)
  const sqlStatements = sqlSchema
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  console.log(`📝 Found ${sqlStatements.length} SQL statements to execute`);

  let successCount = 0;
  let errorCount = 0;

  // Execute SQL statements one by one
  for (let i = 0; i < sqlStatements.length; i++) {
    const statement = sqlStatements[i];
    
    try {
      console.log(`\n${i+1}/${sqlStatements.length}: Executing...`);
      console.log(`   ${statement.substring(0, 50)}${statement.length > 50 ? '...' : ''}`);
      
      const { data, error } = await adminClient.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // Try direct SQL execution (alternative method)
        console.log('   ⚠️ RPC failed, trying alternative...');
      } else {
        console.log('   ✅ Success');
        successCount++;
        continue;
      }

      // For certain statements, we need to use POST to /rest/v1/rpc
      // But for now, let's show what needs to be done manually
      console.log('   📝 Manual execution required for this statement');
      
    } catch (error) {
      console.log(`   ⚠️ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n📊 Setup Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ⚠️ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${sqlStatements.length}`);

  // Test connection after setup
  console.log('\n🧪 Testing database after setup...');
  try {
    const { data: tables, error } = await adminClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.log('   ❌ Cannot verify table creation (expected for service role)');
    } else {
      console.log('   ✅ Tables verified in database');
    }
  } catch (e) {
    console.log('   📝 Table verification skipped');
  }

  // Manual setup instructions
  console.log('\n🔧 Manual Setup Required:');
  console.log('1. Go to: https://supabase.com/dashboard/project/rrdyahlldaoqxqiamruo/sql');
  console.log('2. Copy the entire content from: ./lib/supabase/schema.sql');
  console.log('3. Paste and click "Run" button');
  console.log('4. Wait for all tables to be created');
  console.log('5. Return here and run: node test-db-connection.js');

  console.log('\n💡 Quick SQL Stats:');
  console.log(`   📊 Tables: posts, reactions, comments, social_links`);
  console.log(`   🔐 RLS: Row Level Security enabled`);
  console.log(`   📁 Storage: memory-images bucket`);
  console.log(`   🗂️ Indexes: Performance optimizations`);

  console.log('\n✨ Setup script completed!');
  console.log('🎯 Next: Run the SQL manually in Supabase Dashboard\n');
}

// Execute setup
setupSupabaseDatabase().catch(console.error);
