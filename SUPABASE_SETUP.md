# 🚀 Supabase Setup Instructions

## ✅ Current Status
- **Supabase Project**: https://rrdyahlldaoqxqiamruo.supabase.co ✅ Active
- **API Keys**: Configured ✅
- **Connection**: Working ✅

## 🔧 Step 5: Database Schema Setup

### 1. Open Supabase Dashboard
```
https://supabase.com/dashboard/project/rrdyahlldaoqxqiamruo
```

### 2. Navigate to SQL Editor
- Di dashboard, klik menu **SQL Editor** di sidebar kiri
- Atau langsung: https://supabase.com/dashboard/project/rrdyahlldaoqxqiamruo/sql

### 3. Copy dan Execute Schema SQL
Copy seluruh isi dari `lib/supabase/schema.sql` dan paste ke SQL Editor:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ... (rest of schema)
```

### 4. Execute SQL
- Klik tombol **Run** (▶️) untuk menjalankan SQL
- Tunggu hingga semua tabel berhasil dibuat

### 5. Create Storage Bucket
Setelah tabel dibuat, jalankan SQL ini untuk storage:

```sql
-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('memory-images', 'memory-images', true);

-- Set up storage policies
CREATE POLICY "Anyone can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'memory-images');
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (
  bucket_id = 'memory-images' AND 
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- Allow users to update their own images (if needed)
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE 
  USING (bucket_id = 'memory-images' AND auth.uid()::text = (extract(metadata from raw::text)::json->>'user_id'));
```

### 6. Verify Tables
Kembali ke **Table Editor** dan pastikan tabel-tabel berikut ada:
- ✅ posts
- ✅ reactions  
- ✅ comments
- ✅ social_links
- ⭕ storage.objects (otomatis ada)

## 🧪 Step 6: Test Application

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Pages
- **Main Page**: http://localhost:3000
- **Debug Page**: http://localhost:3000/supabase-debug  
- **Submission**: Klik tombol "Share Memory" untuk test upload

### 3. Test Features
- ✅ Memory submission
- ✅ Image upload
- ✅ Admin dashboard (jika login)
- ✅ Real-time updates

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Test connection
node test-supabase.js

# Check environment
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Storage Issues
- Pastikan bucket `memory-images` ada di Storage section
- Check policies di Settings > Storage > Policies

### Permission Issues
- Pastikan RLS (Row Level Security) sudah di-setup
- Check user permissions di Authentication > Policies

## 📝 Next Steps

1. **Deploy** ke Vercel/Railway/DeployHQ
2. **Setup** production environment variables
3. **Test** dengan production database
4. **Optimize** untuk production performance

## 🆘 Help

- Supabase Docs: https://supabase.com/docs
- Project Dashboard: https://supabase.com/dashboard/project/rrdyahlldaoqxqiamruo
- SQL Editor: https://supabase.com/dashboard/project/rrdyahlldaoqxqiamruo/sql
- Support: https://supabase.com/support
