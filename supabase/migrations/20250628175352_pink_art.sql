/*
  # Add new columns to registrations table

  1. New Columns
    - `customer_id` (text, unique) - Generated unique customer ID
    - `status` (text, default 'pending') - Registration status (pending, approved, rejected)
    - `fee_amount` (numeric, default 0) - Fee amount for the registration
    - `agent_details` (text) - Agent/P.R.O details

  2. Security
    - Maintain existing RLS policies
    - Add index for customer_id for faster lookups
*/

DO $$
BEGIN
  -- Add customer_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE registrations ADD COLUMN customer_id text UNIQUE;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'status'
  ) THEN
    ALTER TABLE registrations ADD COLUMN status text DEFAULT 'pending';
  END IF;

  -- Add fee_amount column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'fee_amount'
  ) THEN
    ALTER TABLE registrations ADD COLUMN fee_amount numeric DEFAULT 0;
  END IF;

  -- Add agent_details column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'agent_details'
  ) THEN
    ALTER TABLE registrations ADD COLUMN agent_details text;
  END IF;
END $$;

-- Create index for customer_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_registrations_customer_id ON registrations(customer_id);
CREATE INDEX IF NOT EXISTS idx_registrations_mobile ON registrations(mobile);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);