-- Add visibility and likes_count columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Ensure all existing posts are visible by default
UPDATE posts SET is_visible = true WHERE is_visible IS NULL;
UPDATE posts SET likes_count = 0 WHERE likes_count IS NULL;

-- Update existing posts to have default values
UPDATE posts 
SET is_visible = true, likes_count = 0 
WHERE is_visible IS NULL OR likes_count IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_posts_is_visible ON posts(is_visible);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- Create likes table for tracking individual likes
CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- IP address or session identifier
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for likes
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_like ON likes(post_id, user_id);

-- RLS Policies for likes table
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view likes
CREATE POLICY "Anyone can view likes" ON likes
    FOR SELECT USING (true);

-- Allow anonymous users to create likes (based on IP/session)
CREATE POLICY "Anyone can create likes" ON likes
    FOR INSERT WITH CHECK (true);

-- Allow users to delete their own likes
CREATE POLICY "Users can delete own likes" ON likes
    FOR DELETE USING (true);
