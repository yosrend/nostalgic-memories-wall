// Supabase Connection Test
export async function testSupabaseConnection() {
  try {
    // Check if environment variables are properly configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔍 Testing Supabase Connection:');
    console.log('URL:', url ? '✅ Set' : '❌ Missing');
    console.log('Anon Key:', anonKey ? '✅ Set' : '❌ Missing');
    console.log('Service Role Key:', serviceRoleKey ? '✅ Set' : '❌ Missing');

    // Check for placeholder values
    if (url === 'your_supabase_project_url' || !url) {
      return {
        success: false,
        error: 'NEXT_PUBLIC_SUPABASE_URL is not configured',
        details: 'Please set your actual Supabase project URL in the .env file'
      };
    }

    if (anonKey === 'your_supabase_anon_key' || !anonKey) {
      return {
        success: false,
        error: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured',
        details: 'Please set your actual Supabase anonymous key in the .env file'
      };
    }

    // Test actual connection
    const { createClient } = await import('./client');
    const supabase = createClient();

    // Test basic connection
    const { data, error } = await supabase.from('posts').select('count').single();

    if (error) {
      return {
        success: false,
        error: 'Failed to connect to Supabase',
        details: error.message,
        code: error.code
      };
    }

    return {
      success: true,
      message: '✅ Successfully connected to Supabase',
      databaseInfo: {
        url: url,
        anonKey: anonKey.slice(0, 10) + '...',
        hasServiceRoleKey: !!serviceRoleKey,
        postsCount: data?.count || 0
      }
    };

  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error during connection test',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Database schema test
export async function testDatabaseSchema() {
  try {
    const { createClient } = await import('./client');
    const supabase = createClient();

    const tables = ['posts', 'reactions', 'comments', 'social_links'];
    const results = {};

    for (const table of tables) {
      try {
        const { count, error } = await supabase.from(table).select('*', { count: 'head()' });
        results[table] = {
          exists: !error,
          count: count || 0,
          error: error?.message
        };
      } catch (err) {
        results[table] = {
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }

    const allTablesExist = Object.values(results).every(r => r.exists);

    return {
      success: allTablesExist,
      results,
      summary: allTablesExist ? 
        '✅ All required tables exist' : 
        '⚠️ Some tables are missing'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Failed to test database schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Storage test
export async function testStorageConnection() {
  try {
    const { createClient } = await import('./client');
    const supabase = createClient();

    // Test getting buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      return {
        success: false,
        error: 'Failed to list storage buckets',
        details: error.message
      };
    }

    const memoryImagesBucket = buckets?.find(b => b.name === 'memory-images');
    
    return {
      success: !!memoryImagesBucket,
      buckets: buckets?.map(b => b.name) || [],
      memoryImagesExists: !!memoryImagesBucket,
      summary: memoryImagesBucket ? 
        '✅ Storage bucket exists' : 
        '⚠️ Memory images bucket not found - please create it'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Failed to test storage connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
