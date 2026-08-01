-- V27__create_dam_asset_schema.sql
-- Database schema for Enterprise Digital Asset Management (DAM) System

CREATE TABLE IF NOT EXISTS dam_assets (
    id BIGSERIAL PRIMARY KEY,
    asset_key VARCHAR(512) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    width INT,
    height INT,
    cdn_url VARCHAR(1024) NOT NULL,
    thumbnail_url VARCHAR(1024),
    is_private BOOLEAN DEFAULT FALSE,
    property_id BIGINT,
    version_number INT DEFAULT 1,
    uploaded_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_dam_assets_category ON dam_assets(category);
CREATE INDEX IF NOT EXISTS idx_dam_assets_property_id ON dam_assets(property_id);
CREATE INDEX IF NOT EXISTS idx_dam_assets_is_deleted ON dam_assets(is_deleted);
CREATE INDEX IF NOT EXISTS idx_dam_assets_created_at ON dam_assets(created_at DESC);

CREATE TABLE IF NOT EXISTS dam_asset_versions (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL REFERENCES dam_assets(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    asset_key VARCHAR(512) NOT NULL,
    cdn_url VARCHAR(1024) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dam_asset_versions_asset_id ON dam_asset_versions(asset_id);

CREATE TABLE IF NOT EXISTS dam_asset_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT,
    action VARCHAR(50) NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dam_asset_audit_logs_asset_id ON dam_asset_audit_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_dam_asset_audit_logs_created_at ON dam_asset_audit_logs(created_at DESC);
