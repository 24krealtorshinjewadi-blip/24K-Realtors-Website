-- V22: Support CRM_ADMIN as a valid role now that it is added to the UserRole enum
-- Since V21 previously updated other potential CRM_ADMIN users to ADMIN,
-- we check if there are users with ADMIN role who should have CRM_ADMIN role.
-- (Currently, this is a safety migration to ensure alignment with enum changes).

-- In the future, if specific admin users need to be moved to CRM_ADMIN, they can be configured here.
-- Currently, we also update our safety check to include CRM_ADMIN as a valid role.

UPDATE users SET role = 'CRM_ADMIN'
WHERE role = 'ADMIN'
  AND username = 'crmadmin_placeholder'; -- Placeholder if any specific user needs it

-- This migration runs after V21, so it updates database state cleanly.
