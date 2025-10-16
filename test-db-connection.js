#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase Database Connection...\n');

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('📋 Configuration:');
  console.log(`   URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Anon Key: ${SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Service Role Key: ${SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);

  // Test dengan Anon Key
  console.log('\n🔐 Testing with Anon Key...');
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Test 1: Coba check posts table
    console.log('   📊 Testing posts table access...');
    const { data: posts, error: postsError } = await client
      .from('posts')
      .select('count', { count: 'exact' });

    if (postsError) {
      console.log(`     ❌ Error: ${postsError.message}`);
      console.log(`     📝 Code: ${postsError.code}`);
    } else {
      console.log(`     ✅ Posts table accessible (${posts.length} records)`);
    }

    // Test 2: Coba insert test record
    console.log('   📝 Testing insert permissions...');
    const { data: insertData, error: insertError } = await client
      .from('posts')
      .insert({
        name: 'Test User',
        content: 'This is a test memory',
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.log(`     ⚠️ Insert Error: ${insertError.message}`);
      console.log(`     📝 Code: ${insertError.code}`);
    } else {
      console.log(`     ✅ Insert successful: ID ${insertData.id}`);
      
      // Cleanup test record
      await client.from('posts').delete().eq('id', insertData.id);
      console.log('     🧹 Test record cleaned up');
    }

  } catch (error) {
    console.log(`     ❌ Connection Error: ${error.message}`);
  }

  // Test dengan Service Role Key (admin)
  if (SERVICE_ROLE_KEY) {
    console.log('\n👑 Testing with Service Role Key...');
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    try {
      // Test 3: Check schema information
      console.log('   🏗️ Testing schema access...');
      const { data: schema, error: schemaError } = await adminClient
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);

      if (schemaError) {
        console.log(`     ⚠️ Schema Error: ${schemaError.message}`);
      } else {
        const tables = schema.map(t => t.table_name).join(', ');
        console.log(`     ✅ Tables found: ${tables}`);
      }

      // Test 4: Get recent posts
      console.log('   📋 Testing posts query...');
      const { data: recentPosts, error: recentError } = await adminClient
        .from('posts')
        .select('id, name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) {
        console.log(`     ❌ Query Error: ${recentError.message}`);
      } else {
        console.log(`     ✅ Recent posts: ${recentPosts.length} found`);
        recentPosts.forEach((post, i) => {
          console.log(`       ${i+1}. ${post.name || 'Anonymous'} - ${post.status} (${post.created_at})`);
        });
      }

    } catch (error) {
      console.log(`     ❌ Admin Connection Error: ${error.message}`);
    }
  }

  // Test 5: Storage bucket check
  console.log('\n📁 Testing Storage access...');
  try {
    const { data: buckets, error: bucketError } = await client
      .storage
      .getBucket('memory-images');

    if (bucketError) {
      console.log(`     ⚠️ Bucket Error: ${bucketError.message}`);
      if (bucketError.message.includes('not found')) {
        console.log('     📝 Fix needed: Run storage setup SQL');
      }
    } else {
      console.log(`     ✅ Memory-images bucket found`);
    }
  } catch (error) {
    console.log(`     ❌ Storage Error: ${error.message}`);
  }

  // Final Status
  console.log('\n🎯 Connection Summary:');
  console.log('   🔗 Project: https://rrdyahlldaoqxqiamruo.supabase.co');
  console.log('   📊 Database: PostgreSQL');
  console.log('   🔐 Auth: Supabase Auth');
  console.log('   📁 Storage: Supabase Storage');
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Setup database schema if tables not found');
  console.log('   2. Configure storage bucket for images');
  console.log('   3. Test application at http://localhost:3000');
  console.log('   4. Check /supabase-debug for detailed status');
  
  console.log('\n✨ Test completed!');
}

// Execute test
testDatabaseConnection().catch(console.error);
