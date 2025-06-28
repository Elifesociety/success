/*
  # Create categories table for managing category fees and images

  1. New Tables
    - `categories`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `actual_fee` (numeric, default 0)
      - `offer_fee` (numeric, default 0)
      - `image` (text) - URL to category image
      - `features` (jsonb) - Array of features
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public read access
    - Add policy for admin write access
*/

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

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active categories
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to read all categories
CREATE POLICY "Authenticated users can read all categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to manage categories (for admin panel)
CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();