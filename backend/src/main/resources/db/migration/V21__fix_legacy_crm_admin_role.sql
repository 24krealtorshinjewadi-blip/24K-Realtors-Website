-- V21: Fix invalid 'CRM_ADMIN' role values left from old system
-- Replaces legacy role strings with valid UserRole enum values.
-- This prevents Hibernate IllegalArgumentException on startup when mapping role column.

UPDATE users SET role = 'SUPER_ADMIN'
WHERE role = 'CRM_ADMIN'
  AND username = 'Manishrai07';

-- Update any other CRM_ADMIN users to ADMIN as a safe fallback
UPDATE users SET role = 'ADMIN'
WHERE role = 'CRM_ADMIN'
  AND username != 'Manishrai07';

-- Verify valid roles only (no-op safety check)
UPDATE users SET role = 'EMPLOYEE'
WHERE role NOT IN (
    'SUPER_ADMIN', 'ADMIN', 'HR', 'ACCOUNTS',
    'SALES_MANAGER', 'RELATIONSHIP_MANAGER',
    'TELECALLER', 'MARKETING', 'EMPLOYEE', 'GUEST'
);
