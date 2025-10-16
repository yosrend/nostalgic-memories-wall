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

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  instagram TEXT,
  facebook TEXT,
  threads TEXT,
  x TEXT,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts table
CREATE POLICY "Anyone can view approved posts" ON posts
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update posts" ON posts
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete posts" ON posts
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for reactions table
CREATE POLICY "Anyone can view reactions for approved posts" ON reactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = reactions.post_id AND posts.status = 'approved')
  );

CREATE POLICY "Anyone can insert reactions" ON reactions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for comments table
CREATE POLICY "Anyone can view comments for approved posts" ON comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND posts.status = 'approved')
  );

CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- RLS Policies for social_links table
CREATE POLICY "Anyone can view social_links" ON social_links
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert social_links" ON social_links
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'memory-images');

CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'memory-images');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
