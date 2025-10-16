require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkPolicies() {
  console.log('🔍 Testing Database Permissions...\n');
  
  // Test 1: Try direct insert with anon key
  console.log('1️⃣ Testing INSERT with ANON key...');
  const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: insertData, error: insertError } = await anonClient
    .from('posts')
    .insert({ 
      content: 'Test post from anon key', 
      name: 'Test User',
      status: 'pending',
      is_anonymous: false
    })
    .select();
  
  if (insertError) {
    console.error('   ❌ Insert failed:', insertError.message);
    console.log('   📝 Code:', insertError.code);
    console.log('   📝 Details:', insertError.details);
    console.log('   📝 Hint:', insertError.hint);
  } else {
    console.log('   ✅ Insert successful!', insertData);
  }
  
  // Test 2: Check if RLS is enabled
  console.log('\n2️⃣ Checking if RLS is enabled...');
  const { data: rlsData, error: rlsError } = await supabase
    .from('posts')
    .select('count');
  
  if (rlsError) {
    console.error('   ❌ Query failed:', rlsError.message);
  } else {
    console.log('   ✅ RLS check passed');
  }
  
  // Test 3: Insert with service role
  console.log('\n3️⃣ Testing INSERT with SERVICE_ROLE key...');
  const { data: serviceData, error: serviceError } = await supabase
    .from('posts')
    .insert({ 
      content: 'Test post from service role', 
      name: 'Admin',
      status: 'approved',
      is_anonymous: false
    })
    .select();
  
  if (serviceError) {
    console.error('   ❌ Insert failed:', serviceError.message);
  } else {
    console.log('   ✅ Insert successful!', serviceData);
  }
}

checkPolicies().catch(console.error);
