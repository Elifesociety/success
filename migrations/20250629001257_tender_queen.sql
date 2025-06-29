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

...
