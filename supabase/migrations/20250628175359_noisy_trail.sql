/*
  Migration: Create categories table for managing category fees and images
  Adds security policies and triggers
*/

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  actual_fee numeric DEFAULT 0,
  offer_fee numeric DEFAULT 0,
  image text,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. Public policy: only read active categories
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- 4. Authenticated policy: read all categories
CREATE POLICY "Authenticated users can read all categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. Authenticated policy: manage categories
CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- 7. Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
