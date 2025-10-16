-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'posts';

-- Drop all policies on posts
DROP POLICY IF EXISTS "posts_insert" ON posts;
DROP POLICY IF EXISTS "posts_select" ON posts;
DROP POLICY IF EXISTS "posts_update" ON posts;
DROP POLICY IF EXISTS "posts_delete" ON posts;
DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
DROP POLICY IF EXISTS "posts_select_policy" ON posts;
DROP POLICY IF EXISTS "posts_update_policy" ON posts;
DROP POLICY IF EXISTS "posts_delete_policy" ON posts;

-- Create the most permissive insert policy possible
CREATE POLICY "allow_all_insert" ON posts
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "allow_approved_select" ON posts
FOR SELECT 
USING (status = 'approved');

-- Let's also check if there are any table grants missing
GRANT ALL ON posts TO anon;
GRANT ALL ON posts TO authenticated;
