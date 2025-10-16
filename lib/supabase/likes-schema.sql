-- Create likes table to track individual likes by IP address
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL, -- Supports IPv6
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, ip_address) -- One like per post per IP
);

-- Create index for faster lookups
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_ip_address ON likes(ip_address);

-- RLS policies for likes table
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Allow users to read likes
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);

-- Allow users to insert their own like (they can only like once per post)
CREATE POLICY "Users can like posts" ON likes FOR INSERT WITH CHECK (true);

-- Allow users to delete their own likes
CREATE POLICY "Users can unlike posts" ON likes FOR DELETE USING (true);

-- Function to get current IP address
CREATE OR REPLACE FUNCTION get_client_ip()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.headers.x-forwarded-for', true)::TEXT,
    current_setting('request.headers.x-real-ip', true)::TEXT,
    inet_client_addr()::TEXT
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely like a post
CREATE OR REPLACE FUNCTION toggle_post_like(post_uuid UUID)
RETURNS TABLE(post_id UUID, liked BOOLEAN, total_likes BIGINT) AS $$
DECLARE
  client_ip TEXT;
  like_exists BOOLEAN;
  current_likes BIGINT;
BEGIN
  -- Get the client IP
  client_ip := get_client_ip();
  
  -- Check if like already exists
  SELECT EXISTS(
    SELECT 1 FROM likes 
    WHERE post_id = post_uuid AND ip_address = client_ip
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Unlike: remove the like
    DELETE FROM likes 
    WHERE post_id = post_uuid AND ip_address = client_ip;
    
    -- Update likes count
    UPDATE posts 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = post_uuid;
    
    RETURN QUERY SELECT post_uuid, false, (
      SELECT COUNT(*) FROM likes WHERE post_id = post_uuid
    );
  ELSE
    -- Like: add the like
    INSERT INTO likes (post_id, ip_address, user_agent)
    VALUES (post_uuid, client_ip, current_setting('request.headers.user-agent', true))
    ON CONFLICT (post_id, ip_address) DO NOTHING;
    
    -- Update likes count
    UPDATE posts 
    SET likes_count = likes_count + 1
    WHERE id = post_uuid;
    
    RETURN QUERY SELECT post_uuid, true, (
      SELECT COUNT(*) FROM likes WHERE post_id = post_uuid
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
