/*
  # Complete Database Reset and Setup
  
  This migration completely resets and recreates all tables from scratch.
  
  1. Drop all existing tables and policies
  2. Create fresh tables with proper structure
  3. Set up security policies
  4. Insert default data
*/

-- Drop all existing tables and their dependencies
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS panchayaths CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL,
  permissions text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create panchayaths table
CREATE TABLE panchayaths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  mobile text NOT NULL,
  panchayath text NOT NULL,
  ward text NOT NULL,
  agent_details text,
  customer_id text UNIQUE,
  status text DEFAULT 'pending',
  fee_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
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

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE panchayaths ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Allow public access on admin_users"
  ON admin_users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for panchayaths
CREATE POLICY "Allow public read access on panchayaths"
  ON panchayaths
  FOR SELECT
  TO public
  USING (true);

-- Create policies for registrations
CREATE POLICY "Allow public read access on registrations"
  ON registrations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on registrations"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for categories
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

-- Create indexes
CREATE INDEX idx_registrations_customer_id ON registrations(customer_id);
CREATE INDEX idx_registrations_mobile ON registrations(mobile);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_admin_users_status ON admin_users(status);

-- Create trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin users
INSERT INTO admin_users (username, password, role, permissions) VALUES
('evaadmin', 'eva919123', 'Super Admin', 'Full access to all features including role management'),
('admin1', 'elife9094', 'Local Admin', 'Can view, add, edit, and delete registrations and panchayaths'),
('admin2', 'penny9094', 'User Admin', 'Read-only access to view registrations only');

-- Insert default panchayaths
INSERT INTO panchayaths (name, district) VALUES
('Thiruvananthapuram', 'Thiruvananthapuram'),
('Kochi', 'Ernakulam'),
('Kozhikode', 'Kozhikode'),
('Thrissur', 'Thrissur'),
('Kollam', 'Kollam');

-- Insert default categories
INSERT INTO categories (id, name, description, actual_fee, offer_fee, features) VALUES
('pennyekart-free', 'Pennyekart Free Registration', 'Totally free registration with basic level access. Free delivery between 2pm to 6pm.', 0, 0, '["Free registration", "Free delivery (2pm-6pm)", "Basic level access", "E-commerce platform access"]'::jsonb),
('pennyekart-paid', 'Pennyekart Paid Registration', 'Premium registration with extended delivery hours and enhanced features.', 500, 299, '["Any time delivery (8am-7pm)", "Premium features", "Priority support", "Extended service hours"]'::jsonb),
('farmelife', 'Farmelife', 'Connected with dairy farm, poultry farm and agricultural businesses.', 800, 599, '["Dairy farm connections", "Poultry farm network", "Agricultural business support", "Farm-to-market solutions"]'::jsonb),
('organelife', 'Organelife', 'Connected with vegetable and house gardening, especially terrace vegetable farming.', 600, 399, '["Organic farming support", "Terrace gardening solutions", "Vegetable farming network", "Sustainable agriculture"]'::jsonb),
('foodelif', 'Foodelif', 'Connected with food processing business and culinary services.', 700, 499, '["Food processing business", "Culinary services", "Recipe sharing platform", "Food quality certification"]'::jsonb),
('entrelife', 'Entrelife', 'Connected with skilled projects like stitching, art works, and various home services.', 650, 449, '["Skilled project management", "Stitching and tailoring", "Art and craft services", "Home service network"]'::jsonb),
('job-card', 'Job Card', 'Special offer card with access to all categories, special discounts, and investment opportunities.', 2000, 999, '["Access to all categories", "Special fee cut packages", "Exclusive offers and discounts", "Investment card benefits", "Convertible to any category", "Points and profit system"]'::jsonb);