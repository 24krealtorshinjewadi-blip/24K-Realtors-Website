ALTER TABLE properties ADD COLUMN verified_listing BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN exclusive_deal BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN no_brokerage BOOLEAN NOT NULL DEFAULT FALSE;

-- Indexing for quick lookups on promotional flags
CREATE INDEX idx_properties_promo_flags ON properties(verified_listing, exclusive_deal, no_brokerage);
