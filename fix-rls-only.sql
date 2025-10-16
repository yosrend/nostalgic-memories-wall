-- First, let's check if policies exist and drop them
DO $$ 
BEGIN
    -- Drop policies if they exist
    DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
    DROP POLICY IF EXISTS "Anyone can view approved posts" ON posts;
    DROP POLICY IF EXISTS "Admins can update posts" ON posts;
    DROP POLICY IF EXISTS "Admins can delete posts" ON posts;
END $$;

-- Create policies with explicit permissions
CREATE POLICY "Enable insert for all users" 
ON posts FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for approved posts" 
ON posts FOR SELECT 
TO anon, authenticated 
USING (status = 'approved');

CREATE POLICY "Enable update for service role" 
ON posts FOR UPDATE 
TO service_role 
USING (true);

CREATE POLICY "Enable delete for service role" 
ON posts FOR DELETE 
TO service_role 
USING (true);

-- Same for reactions
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can insert reactions" ON reactions;
    DROP POLICY IF EXISTS "Anyone can view reactions for approved posts" ON reactions;
END $$;

CREATE POLICY "Enable insert for all users" 
ON reactions FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for reactions" 
ON reactions FOR SELECT 
TO anon, authenticated 
USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = reactions.post_id AND posts.status = 'approved')
);

-- Same for comments
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
    DROP POLICY IF EXISTS "Anyone can view comments for approved posts" ON comments;
END $$;

CREATE POLICY "Enable insert for all users" 
ON comments FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for comments" 
ON comments FOR SELECT 
TO anon, authenticated 
USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id AND posts.status = 'approved')
);

-- Same for social_links
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can insert social_links" ON social_links;
    DROP POLICY IF EXISTS "Anyone can view social_links" ON social_links;
END $$;

CREATE POLICY "Enable insert for all users" 
ON social_links FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for all users" 
ON social_links FOR SELECT 
TO anon, authenticated 
USING (true);
