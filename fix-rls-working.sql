-- Drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on posts table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'posts') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON posts';
    END LOOP;
    
    -- Drop all policies on reactions table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reactions') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON reactions';
    END LOOP;
    
    -- Drop all policies on comments table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'comments') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON comments';
    END LOOP;
    
    -- Drop all policies on social_links table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'social_links') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON social_links';
    END LOOP;
END $$;

-- Create policies for posts with correct role specifications
CREATE POLICY "posts_insert" ON posts
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "posts_select" ON posts
FOR SELECT TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "posts_update" ON posts
FOR UPDATE TO service_role
WITH CHECK (true);

CREATE POLICY "posts_delete" ON posts
FOR DELETE TO service_role
USING (true);

-- Create policies for reactions
CREATE POLICY "reactions_insert" ON reactions
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "reactions_select" ON reactions
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = reactions.post_id 
    AND posts.status = 'approved'
  )
);

-- Create policies for comments
CREATE POLICY "comments_insert" ON comments
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "comments_select" ON comments
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = comments.post_id 
    AND posts.status = 'approved'
  )
);

-- Create policies for social_links
CREATE POLICY "social_links_insert" ON social_links
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "social_links_select" ON social_links
FOR SELECT TO anon, authenticated
USING (true);
