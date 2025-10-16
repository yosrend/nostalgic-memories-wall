-- First, disable RLS temporarily to clean up
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE reactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Enable insert for all users" ON posts;
DROP POLICY IF EXISTS "Anyone can view approved posts" ON posts;
DROP POLICY IF EXISTS "Enable read for approved posts" ON posts;
DROP POLICY IF EXISTS "Admins can update posts" ON posts;
DROP POLICY IF EXISTS "Enable update for service role" ON posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON posts;
DROP POLICY IF EXISTS "Enable delete for service role" ON posts;

DROP POLICY IF EXISTS "Anyone can insert reactions" ON reactions;
DROP POLICY IF EXISTS "Enable insert for all users" ON reactions;
DROP POLICY IF EXISTS "Anyone can view reactions for approved posts" ON reactions;
DROP POLICY IF EXISTS "Enable read for reactions" ON reactions;

DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Enable insert for all users" ON comments;
DROP POLICY IF EXISTS "Anyone can view comments for approved posts" ON comments;
DROP POLICY IF EXISTS "Enable read for comments" ON comments;

DROP POLICY IF EXISTS "Anyone can insert social_links" ON social_links;
DROP POLICY IF EXISTS "Enable insert for all users" ON social_links;
DROP POLICY IF EXISTS "Anyone can view social_links" ON social_links;
DROP POLICY IF EXISTS "Enable read for all users" ON social_links;

-- Re-enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for posts
CREATE POLICY "posts_insert_policy" 
ON posts FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "posts_select_policy" 
ON posts FOR SELECT 
TO public
USING (status = 'approved' OR auth.role() = 'service_role');

CREATE POLICY "posts_update_policy" 
ON posts FOR UPDATE 
TO public
USING (auth.role() = 'service_role');

CREATE POLICY "posts_delete_policy" 
ON posts FOR DELETE 
TO public
USING (auth.role() = 'service_role');

-- Create policies for reactions
CREATE POLICY "reactions_insert_policy" 
ON reactions FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "reactions_select_policy" 
ON reactions FOR SELECT 
TO public
USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = reactions.post_id 
    AND (posts.status = 'approved' OR auth.role() = 'service_role')
  )
);

-- Create policies for comments
CREATE POLICY "comments_insert_policy" 
ON comments FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "comments_select_policy" 
ON comments FOR SELECT 
TO public
USING (
  EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = comments.post_id 
    AND (posts.status = 'approved' OR auth.role() = 'service_role')
  )
);

-- Create policies for social_links
CREATE POLICY "social_links_insert_policy" 
ON social_links FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "social_links_select_policy" 
ON social_links FOR SELECT 
TO public
USING (true);
