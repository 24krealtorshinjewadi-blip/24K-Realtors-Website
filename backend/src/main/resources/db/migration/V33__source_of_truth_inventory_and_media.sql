-- Migration V33: Source of Truth Inventory, Verifications, Sources, Hierarchy and Media Assets
-- Establishes single source of truth data architecture according to Master Implementation Prompt

-- 1. Locations Hierarchy
ALTER TABLE localities ADD COLUMN IF NOT EXISTS parent_locality_id UUID REFERENCES localities(id) ON DELETE SET NULL;
ALTER TABLE localities ADD COLUMN IF NOT EXISTS locality_type VARCHAR(50) DEFAULT 'MICRO_MARKET';
CREATE INDEX IF NOT EXISTS idx_localities_parent ON localities(parent_locality_id);

-- 2. Inventory Sources
CREATE TABLE IF NOT EXISTS inventory_sources (
    id UUID PRIMARY KEY,
    source_type VARCHAR(50) NOT NULL, -- BUILDER, TWENTYFOURK_INTERNAL, OWNER, CHANNEL_PARTNER, API, CSV
    source_name VARCHAR(255) NOT NULL,
    reference VARCHAR(255),
    authorized BOOLEAN NOT NULL DEFAULT TRUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inv_src_type ON inventory_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_inv_src_auth ON inventory_sources(authorized, active);

-- 3. Extend inventory_units with Source-of-Truth & Freshness Columns
ALTER TABLE inventory_units ADD COLUMN IF NOT EXISTS price_per_sqft NUMERIC(15, 2);
ALTER TABLE inventory_units ADD COLUMN IF NOT EXISTS parking VARCHAR(50);
ALTER TABLE inventory_units ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE inventory_units ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES inventory_sources(id) ON DELETE SET NULL;
ALTER TABLE inventory_units ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP;
ALTER TABLE inventory_units ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE inventory_units ADD COLUMN IF NOT EXISTS publication_status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED';

-- 4. Inventory Verifications
CREATE TABLE IF NOT EXISTS inventory_verifications (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL REFERENCES inventory_units(id) ON DELETE CASCADE,
    source_id UUID REFERENCES inventory_sources(id) ON DELETE SET NULL,
    verified_by VARCHAR(200) NOT NULL,
    price_verified BOOLEAN NOT NULL DEFAULT TRUE,
    availability_verified BOOLEAN NOT NULL DEFAULT TRUE,
    verified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inv_verif_inv_id ON inventory_verifications(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inv_verif_date ON inventory_verifications(verified_at);

-- 5. Inventory Status History (Auditable Lifecycle)
CREATE TABLE IF NOT EXISTS inventory_status_history (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL REFERENCES inventory_units(id) ON DELETE CASCADE,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(200),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_inv_hist_inv_id ON inventory_status_history(inventory_id);

-- 6. Authentic Media Assets (With strict Aerial & Real Project tags)
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES inventory_units(id) ON DELETE SET NULL,
    asset_type VARCHAR(50) NOT NULL, -- PROJECT_HERO, REAL_PROJECT, AERIAL, MASTER_PLAN, FLOOR_PLAN, INTERIOR, AMENITY, LOCATION, BROCHURE
    url VARCHAR(1024) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    source VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_project_id ON media_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_media_inventory_id ON media_assets(inventory_id);
CREATE INDEX IF NOT EXISTS idx_media_asset_type ON media_assets(asset_type);

-- 7. Lead Extensions for Project & Inventory Tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS society_id UUID REFERENCES societies(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS inventory_id UUID REFERENCES inventory_units(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_source VARCHAR(100) DEFAULT 'PORTAL_HERO';

CREATE INDEX IF NOT EXISTS idx_lead_society ON leads(society_id);
CREATE INDEX IF NOT EXISTS idx_lead_inventory ON leads(inventory_id);

-- 8. High-Performance Query Composite Indexes
CREATE INDEX IF NOT EXISTS idx_inv_search_avail ON inventory_units(society_id, status, publication_status);
CREATE INDEX IF NOT EXISTS idx_inv_total_price ON inventory_units(total_price);
CREATE INDEX IF NOT EXISTS idx_inv_carpet_sqft ON inventory_units(carpet_area_sqft);
