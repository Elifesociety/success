/*
  # Add status column to admin_users table

  1. New Columns
    - `status` (text, default 'active') - Admin status (active, inactive)

  2. Security
    - Maintain existing RLS policies
*/

DO $$
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'status'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN status text DEFAULT 'active';
  END IF;
END $$;

-- Create index for status
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON admin_users(status);