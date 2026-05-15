-- Add correction_notes column to orders for admin-to-customer communication
ALTER TABLE orders ADD COLUMN IF NOT EXISTS correction_notes TEXT;
