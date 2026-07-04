-- V17__society_portal_schema.sql

-- 1. Builders Table
CREATE TABLE builders (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo_url VARCHAR(1024),
    description TEXT,
    experience_years INT,
    completed_projects_count INT,
    ongoing_projects_count INT,
    awards TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0
);

-- 2. Societies Table
CREATE TABLE societies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    developer VARCHAR(255) NOT NULL,
    rera_number VARCHAR(100) NOT NULL,
    project_status VARCHAR(50) NOT NULL,
    starting_price DECIMAL(15, 2) NOT NULL,
    possession_date VARCHAR(100),
    overview TEXT,
    gallery_urls TEXT,
    amenities TEXT,
    floor_plan_urls TEXT,
    master_plan_url VARCHAR(1024),
    property_types TEXT,
    price_range VARCHAR(100),
    configuration VARCHAR(100),
    nearby_schools TEXT,
    nearby_hospitals TEXT,
    nearby_it_parks TEXT,
    nearby_metro TEXT,
    nearby_malls TEXT,
    google_maps_iframe TEXT,
    travel_time_info TEXT,
    investment_score INT DEFAULT 75,
    rental_yield DOUBLE PRECISION DEFAULT 4.0,
    faqs TEXT,
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    builder_id UUID REFERENCES builders(id) ON DELETE SET NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0
);

-- 3. Localities Table
CREATE TABLE localities (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    overview TEXT,
    connectivity_info TEXT,
    schools TEXT,
    hospitals TEXT,
    markets TEXT,
    metro_connectivity TEXT,
    investment_analysis TEXT,
    rental_demand TEXT,
    future_growth TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0
);

-- 4. Alter Properties Table to Link with Societies
ALTER TABLE properties ADD COLUMN society_id UUID REFERENCES societies(id) ON DELETE SET NULL;

-- 5. Create Performance Indexes
CREATE INDEX idx_builders_slug ON builders(slug);
CREATE INDEX idx_societies_slug ON societies(slug);
CREATE INDEX idx_societies_builder ON societies(builder_id);
CREATE INDEX idx_localities_slug ON localities(slug);
CREATE INDEX idx_properties_society ON properties(society_id);
