-- Migration: Initial schema for dog poop logger
-- Created: 2025

-- Create poops table
CREATE TABLE IF NOT EXISTS poops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID directly
  dog_name VARCHAR(100) NOT NULL,
  location VARCHAR(255), -- Optional location description
  notes VARCHAR(500), -- Optional notes
  photo_url TEXT, -- Optional photo of the poop
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_poops_user_id 
ON poops(user_id);

CREATE INDEX IF NOT EXISTS idx_poops_user_created 
ON poops(user_id, created_at);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_poops_updated_at ON poops;
CREATE TRIGGER update_poops_updated_at
    BEFORE UPDATE ON poops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS disabled since we're using Clerk auth in API routes
