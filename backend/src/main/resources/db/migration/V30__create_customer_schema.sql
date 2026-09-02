-- ==============================================================================
-- Migration: V30__create_customer_schema.sql
-- Description: Create Customer 360 & Investor Profile schema for CRM
-- ==============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    alternate_phone VARCHAR(50),
    pan_number VARCHAR(20),
    aadhar_number VARCHAR(20),
    city VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    address TEXT,
    customer_type VARCHAR(50) NOT NULL DEFAULT 'INDIVIDUAL_BUYER',
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_investment_amount NUMERIC(18, 2) DEFAULT 0.00,
    converted_from_lead_id UUID,
    assigned_agent_id UUID,
    notes TEXT,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_customer_lead FOREIGN KEY (converted_from_lead_id) REFERENCES leads(id) ON DELETE SET NULL,
    CONSTRAINT fk_customer_agent FOREIGN KEY (assigned_agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_kyc ON customers(kyc_status);
CREATE INDEX IF NOT EXISTS idx_customers_created ON customers(created_date);

-- Add customer_id reference to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_id UUID;
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
