-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  prompt TEXT NOT NULL,
  refined_prompt TEXT,
  tone TEXT NOT NULL,
  visual_style TEXT NOT NULL,
  user_id UUID,
  approved BOOLEAN NOT NULL DEFAULT false
);

-- Create feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  feedback_text TEXT NOT NULL,
  user_id UUID
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user'
);

-- Add foreign key from feedback to users
ALTER TABLE feedback 
  ADD CONSTRAINT feedback_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE SET NULL;

-- Add foreign key from posts to users
ALTER TABLE posts 
  ADD CONSTRAINT posts_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE SET NULL;

-- Create RLS policies for posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for feedback table
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read feedback
CREATE POLICY "Anyone can read feedback"
  ON feedback
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert feedback
CREATE POLICY "Authenticated users can insert feedback"
  ON feedback
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read other user profiles
CREATE POLICY "Anyone can read user profiles"
  ON users
  FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id); 