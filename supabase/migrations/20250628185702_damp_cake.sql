/*
  # Create categories table with proper conflict handling

  1. New Tables
    - `categories`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `actual_fee` (numeric, default 0)
      - `offer_fee` (numeric, default 0)
      - `image` (text)
      - `features` (jsonb, default [])
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `categories` table
    - Add policies for public and authenticated access
    - Add trigger for updated_at column

  3. Data
    - Insert default category data
*/

-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create categories table
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

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public can read active categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can read all categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;

-- Create policies
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;

-- Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (id, name, description, actual_fee, offer_fee, features, is_active) VALUES
('pennyekart-free', 'Pennyekart Free Registration', 'Totally free registration with basic level access. Free delivery between 2pm to 6pm.', 0, 0, '["Free registration", "Free delivery (2pm-6pm)", "Basic level access", "E-commerce platform access"]'::jsonb, true),
('pennyekart-paid', 'Pennyekart Paid Registration', 'Premium registration with extended delivery hours and enhanced features.', 500, 299, '["Any time delivery (8am-7pm)", "Premium features", "Priority support", "Extended service hours"]'::jsonb, true),
('farmelife', 'Farmelife', 'Connected with dairy farm, poultry farm and agricultural businesses.', 800, 599, '["Dairy farm connections", "Poultry farm network", "Agricultural business support", "Farm-to-market solutions"]'::jsonb, true),
('organelife', 'Organelife', 'Connected with vegetable and house gardening, especially terrace vegetable farming.', 600, 399, '["Organic farming support", "Terrace gardening solutions", "Vegetable farming network", "Sustainable agriculture"]'::jsonb, true),
('foodelif', 'Foodelif', 'Connected with food processing business and culinary services.', 700, 499, '["Food processing business", "Culinary services", "Recipe sharing platform", "Food quality certification"]'::jsonb, true),
('entrelife', 'Entrelife', 'Connected with skilled projects like stitching, art works, and various home services.', 650, 449, '["Skilled project management", "Stitching and tailoring", "Art and craft services", "Home service network"]'::jsonb, true),
('job-card', 'Job Card', 'Special offer card with access to all categories, special discounts, and investment opportunities.', 2000, 999, '["Access to all categories", "Special fee cut packages", "Exclusive offers and discounts", "Investment card benefits", "Convertible to any category", "Points and profit system"]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  actual_fee = EXCLUDED.actual_fee,
  offer_fee = EXCLUDED.offer_fee,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  updated_at = now();