ALTER TABLE properties ADD COLUMN latitude DOUBLE PRECISION;
ALTER TABLE properties ADD COLUMN longitude DOUBLE PRECISION;

-- Composite index to optimize radial geo-queries
CREATE INDEX idx_properties_coords ON properties(latitude, longitude);
