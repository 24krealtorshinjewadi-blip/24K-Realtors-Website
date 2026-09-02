-- Migration V31: Create Inventory Units & Seed Initial Real Estate Inventory
-- Supports unit-level inventory tracking for towers, wings, floors, and unit status

-- 1. Ensure Society intelligence schema columns exist (matching Society.java)
ALTER TABLE societies ADD COLUMN IF NOT EXISTS canonical_name VARCHAR(300);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS alias_names TEXT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS parent_project_id UUID;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS hinjewadi_phase VARCHAR(30);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS full_address VARCHAR(500);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS landmark VARCHAR(255);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS road VARCHAR(255);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS google_maps_url VARCHAR(1024);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS rera_registered BOOLEAN DEFAULT FALSE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS rera_project_name VARCHAR(300);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS rera_promoter_name VARCHAR(300);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS rera_status VARCHAR(100);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS rera_registration_date DATE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS rera_completion_date DATE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS rera_source_url VARCHAR(1024);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS launch_year INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS completion_date DATE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS land_area_acres DOUBLE PRECISION;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS total_units INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS total_towers INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS total_floors INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS number_of_phases INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS min_carpet_area_sqft INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS max_carpet_area_sqft INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS price_per_sqft INT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS price_source VARCHAR(200);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS price_last_verified DATE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS has_new_sale BOOLEAN DEFAULT FALSE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS has_resale BOOLEAN DEFAULT FALSE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS has_rental BOOLEAN DEFAULT FALSE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS confidence_level VARCHAR(20) DEFAULT 'UNVERIFIED';
ALTER TABLE societies ADD COLUMN IF NOT EXISTS last_verified_at DATE;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS researcher_notes TEXT;
ALTER TABLE societies ADD COLUMN IF NOT EXISTS seo_h1 VARCHAR(300);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS seo_primary_keyword VARCHAR(200);

-- Ensure Builder columns exist
ALTER TABLE builders ADD COLUMN IF NOT EXISTS official_website VARCHAR(500);
ALTER TABLE builders ADD COLUMN IF NOT EXISTS parent_company VARCHAR(255);

-- Populate canonical_name from name where null
UPDATE societies SET canonical_name = name WHERE canonical_name IS NULL;

-- 2. Create inventory_units table
CREATE TABLE IF NOT EXISTS inventory_units (
    id UUID PRIMARY KEY,
    unit_number VARCHAR(50) NOT NULL,
    tower VARCHAR(100),
    floor_number INT,
    bhk_type VARCHAR(50) NOT NULL,
    carpet_area_sqft DOUBLE PRECISION NOT NULL,
    super_built_up_sqft DOUBLE PRECISION,
    base_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    facing VARCHAR(50),
    furnishing_status VARCHAR(50) DEFAULT 'UNFURNISHED',
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    society_id UUID REFERENCES societies(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    assigned_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    notes TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_inv_unit_number ON inventory_units(unit_number);
CREATE INDEX IF NOT EXISTS idx_inv_status ON inventory_units(status);
CREATE INDEX IF NOT EXISTS idx_inv_bhk_type ON inventory_units(bhk_type);
CREATE INDEX IF NOT EXISTS idx_inv_society ON inventory_units(society_id);
CREATE INDEX IF NOT EXISTS idx_inv_property ON inventory_units(property_id);
CREATE INDEX IF NOT EXISTS idx_inv_customer ON inventory_units(customer_id);
CREATE INDEX IF NOT EXISTS idx_inv_assigned_agent ON inventory_units(assigned_agent_id);

-- 3. Seed Authentic Real-World Inventory Units across Pune West Flagship Societies
MERGE INTO inventory_units (
    id, unit_number, tower, floor_number, bhk_type, carpet_area_sqft, super_built_up_sqft,
    base_price, total_price, facing, furnishing_status, status, society_id, notes
) KEY (id) VALUES
-- Kolte Patil Life Republic (Society ID: c1000000-0000-0000-0000-000000000001)
(
    'e1000000-0000-0000-0000-000000000001', 'T2-402', 'Tower 2 (Arezo)', 4, '2 BHK', 780.0, 1050.0,
    7200000.00, 7850000.00, 'East Facing', 'SEMI_FURNISHED', 'AVAILABLE',
    'c1000000-0000-0000-0000-000000000001', 'Garden facing corner unit with modular kitchen'
),
(
    'e1000000-0000-0000-0000-000000000002', 'T2-804', 'Tower 2 (Arezo)', 8, '3 BHK', 1150.0, 1550.0,
    11500000.00, 12600000.00, 'North-East', 'UNFURNISHED', 'ON_HOLD',
    'c1000000-0000-0000-0000-000000000001', 'High floor park view, client token in process'
),
(
    'e1000000-0000-0000-0000-000000000003', 'T3-1204', 'Tower 3 (Oro Avenue)', 12, '2 BHK', 820.0, 1100.0,
    7600000.00, 8300000.00, 'East Facing', 'UNFURNISHED', 'AVAILABLE',
    'c1000000-0000-0000-0000-000000000001', 'Direct hill view, eligible for special festive waiver'
),
(
    'e1000000-0000-0000-0000-000000000004', 'T1-1502', 'Tower 1 (Universe)', 15, '3 BHK', 1280.0, 1720.0,
    14500000.00, 15800000.00, 'North Facing', 'FULLY_FURNISHED', 'BOOKED',
    'c1000000-0000-0000-0000-000000000001', 'Booked via NRI investor desk'
),
(
    'e1000000-0000-0000-0000-000000000005', 'T4-1801', 'Tower 4 (Universe)', 18, '4 BHK', 1850.0, 2450.0,
    21000000.00, 22800000.00, 'East Facing', 'FULLY_FURNISHED', 'SOLD',
    'c1000000-0000-0000-0000-000000000001', 'Penthouse duplex, registry completed'
),

-- Shapoorji Pallonji Joyville Hinjewadi (Society ID: c1000000-0000-0000-0000-000000000002)
(
    'e1000000-0000-0000-0000-000000000006', 'J1-503', 'Tower Alpine', 5, '2 BHK', 720.0, 970.0,
    8100000.00, 8850000.00, 'East Facing', 'SEMI_FURNISHED', 'AVAILABLE',
    'c1000000-0000-0000-0000-000000000002', 'Ready to move OC received, Miyawaki forest facing'
),
(
    'e1000000-0000-0000-0000-000000000007', 'J2-1102', 'Tower Sierra', 11, '3 BHK', 1040.0, 1400.0,
    12800000.00, 13950000.00, 'North-East', 'UNFURNISHED', 'AVAILABLE',
    'c1000000-0000-0000-0000-000000000002', 'Clubhouse and pool view, zero brokerage direct deal'
),
(
    'e1000000-0000-0000-0000-000000000008', 'J2-1404', 'Tower Sierra', 14, '3 BHK', 1040.0, 1400.0,
    13100000.00, 14300000.00, 'North Facing', 'SEMI_FURNISHED', 'ON_HOLD',
    'c1000000-0000-0000-0000-000000000002', 'VIP client site visit done, awaiting loan sanction'
),
(
    'e1000000-0000-0000-0000-000000000009', 'J3-801', 'Tower Summit', 8, '2 BHK', 720.0, 970.0,
    8300000.00, 9050000.00, 'West Facing', 'UNFURNISHED', 'SOLD',
    'c1000000-0000-0000-0000-000000000002', 'Sold to tech executive from Infosys Phase 1'
),

-- Godrej Elements Hinjewadi (Society ID: c1000000-0000-0000-0000-000000000003)
(
    'e1000000-0000-0000-0000-000000000010', 'E1-704', 'Tower Earth', 7, '2 BHK', 790.0, 1060.0,
    8900000.00, 9700000.00, 'North-East', 'FULLY_FURNISHED', 'AVAILABLE',
    'c1000000-0000-0000-0000-000000000003', 'Schneider smart home automation pre-installed'
),
(
    'e1000000-0000-0000-0000-000000000011', 'E2-1402', 'Tower Air', 14, '3 BHK', 1190.0, 1600.0,
    15500000.00, 16900000.00, 'East Facing', 'SEMI_FURNISHED', 'BOOKED',
    'c1000000-0000-0000-0000-000000000003', 'Agreement for sale drafted, initial 10% received'
),
(
    'e1000000-0000-0000-0000-000000000012', 'E2-1903', 'Tower Air', 19, '3 BHK', 1220.0, 1640.0,
    16200000.00, 17650000.00, 'North Facing', 'UNFURNISHED', 'BLOCKED',
    'c1000000-0000-0000-0000-000000000003', 'Management quota blocked for institutional investor'
),

-- Paranjape Blue Ridge (Society ID: c1000000-0000-0000-0000-000000000004)
(
    'e1000000-0000-0000-0000-000000000013', 'B5-302', 'Tower 5', 3, '1 BHK', 520.0, 710.0,
    4900000.00, 5450000.00, 'East Facing', 'FULLY_FURNISHED', 'AVAILABLE',
    'c1000000-0000-0000-0000-000000000004', 'High rental yield potential near Cognizant campus'
),
(
    'e1000000-0000-0000-0000-000000000014', 'B12-1004', 'Tower 12', 10, '2 BHK', 840.0, 1140.0,
    7800000.00, 8550000.00, 'North-East', 'SEMI_FURNISHED', 'AVAILABLE',
    'c1000000-0000-0000-0000-000000000004', 'Riverside golf course views, newly renovated'
),
(
    'e1000000-0000-0000-0000-000000000015', 'B8-1601', 'Tower 8', 16, '3 BHK', 1350.0, 1820.0,
    14200000.00, 15500000.00, 'North Facing', 'FULLY_FURNISHED', 'SOLD',
    'c1000000-0000-0000-0000-000000000004', 'Fully paid, key handover done'
);
