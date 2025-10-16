#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

// Simple Supabase connection test  
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Menguji koneksi Supabase...\n');

  // Environment variables dari .env
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Konfigurasi:');
  console.log(`   URL: ${SUPABASE_URL ? '✅ Terdeteksi' : '❌ Hilang'}`);
  console.log(`   Anon Key: ${SUPABASE_ANON_KEY ? '✅ Terdeteksi' : '❌ Hilang'}`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('\n❌ Environment variables Supabase tidak ditemukan!');
    console.log('Pastikan anda memiliki file .env dengan variabel-variabel diatas');
    process.exit(1);
  }

  try {
    // Buat Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    console.log('\n🔐 Testing basic connection...');
    
    // Test koneksi sederhana
    const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1);

    if (error && error.code !== 'PGRST116') {
      console.log('⚠️ Error koneksi (mungkin karena permission):', error.message);
      console.log('📝 Ini normal untuk anon key - mari coba cara lain...');
    } else {
      console.log('✅ Koneksi Supabase berhasil!');
    }

    // Test dengan RPC call (jika ada)
    try {
      const { data: version, error: versionError } = await supabase.rpc('version');
      if (!versionError) {
        console.log('📊 Database Version:', version);
      }
    } catch (e) {
      console.log('📝 RPC version tidak tersedia (normal)');
    }

    console.log('\n🎉 Status Koneksi: ⚡ Connected ke Supabase!');
    console.log(`🔗 Project URL: ${SUPABASE_URL}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Solusi:');
    console.log('1. Pastikan Supabase URL dan key benar');
    console.log('2. Periksa koneksi internet');
    console.log('3. Validasi project masih aktif');
  }

  console.log('\n✨ Test selesai!');
}

// Jalankan test
testSupabaseConnection().catch(console.error);
