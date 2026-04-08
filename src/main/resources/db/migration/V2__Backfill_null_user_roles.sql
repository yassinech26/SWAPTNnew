-- Ensure legacy users always have a role value.
UPDATE users
SET role = 'USER'
WHERE role IS NULL;