const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const hasAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection:');
console.log(`✅ URL: ${!!url}`);
console.log(`✅ Anon Key: ${hasAnonKey}`);
console.log(`✅ Service Role Key: ${hasServiceKey}`);
console.log(`✅ Fully Configured: ${url && hasAnonKey && hasServiceKey ? 'Yes' : 'No'}`);
