-- Flyway Migration: Add role column to users table
-- Update all existing users with role = 'USER'

UPDATE users SET role = 'USER' WHERE role IS NULL;

-- If the column doesn't exist yet, Hibernate will create it, so we don't need to add it here
-- This script just ensures existing users get a default role
