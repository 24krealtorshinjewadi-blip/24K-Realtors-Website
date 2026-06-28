-- Drop tables if they exist (clean setup)
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS properties;

-- Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    area_square_feet DOUBLE PRECISION NOT NULL,
    location VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    requirement_type VARCHAR(50) NOT NULL,
    budget_min DECIMAL(15, 2),
    budget_max DECIMAL(15, 2),
    preferred_location VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes for Advanced Filtering
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type_trans ON properties(property_type, transaction_type);
CREATE INDEX idx_properties_status ON properties(status);

-- Indexes for CRM Lead Pipeline tracking
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_date ON leads(created_date);
