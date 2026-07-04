-- Add audit and soft delete columns to properties table
ALTER TABLE properties ADD COLUMN active_flag BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE properties ADD COLUMN deleted_flag BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN version INT NOT NULL DEFAULT 0;
ALTER TABLE properties ADD COLUMN created_by UUID;
ALTER TABLE properties ADD COLUMN updated_by UUID;

-- Add audit and soft delete columns to leads table
ALTER TABLE leads ADD COLUMN active_flag BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE leads ADD COLUMN deleted_flag BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN version INT NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN created_by UUID;
ALTER TABLE leads ADD COLUMN updated_by UUID;

-- Add audit and soft delete columns to agents table
ALTER TABLE agents ADD COLUMN active_flag BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE agents ADD COLUMN deleted_flag BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE agents ADD COLUMN version INT NOT NULL DEFAULT 0;
ALTER TABLE agents ADD COLUMN created_by UUID;
ALTER TABLE agents ADD COLUMN updated_by UUID;

-- Add audit and soft delete columns to users table
ALTER TABLE users ADD COLUMN active_flag BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN deleted_flag BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN version INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN created_by UUID;
ALTER TABLE users ADD COLUMN updated_by UUID;
ALTER TABLE users ADD COLUMN updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create Audit Logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID,
    username VARCHAR(100),
    action VARCHAR(255) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    browser_agent VARCHAR(512),
    device_info VARCHAR(100),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_name, entity_id);
