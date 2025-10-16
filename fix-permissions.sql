-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert reactions" ON reactions;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert social_links" ON social_links;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;

-- Recreate insert policies with correct permissions
CREATE POLICY "Anyone can insert posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert reactions" ON reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert social_links" ON social_links
  FOR INSERT WITH CHECK (true);

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'memory-images', 
  'memory-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png'];

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

-- Recreate storage policies
CREATE POLICY "Anyone can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'memory-images');

CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'memory-images');

CREATE POLICY "Anyone can delete their images" ON storage.objects
  FOR DELETE USING (bucket_id = 'memory-images');
