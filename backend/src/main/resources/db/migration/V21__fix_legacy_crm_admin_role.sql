-- V21: Promote Manishrai07 from CRM_ADMIN to SUPER_ADMIN
-- Ensures the primary user has full SUPER_ADMIN privileges after role enum expansion.

UPDATE users SET role = 'SUPER_ADMIN'
WHERE role = 'CRM_ADMIN'
  AND username = 'Manishrai07';

-- Safety: Reset any genuinely invalid role strings to EMPLOYEE
UPDATE users SET role = 'EMPLOYEE'
WHERE role NOT IN (
    'SUPER_ADMIN', 'ADMIN', 'CRM_ADMIN', 'HR', 'ACCOUNTS',
    'SALES_MANAGER', 'RELATIONSHIP_MANAGER',
    'TELECALLER', 'MARKETING', 'EMPLOYEE', 'GUEST'
);
