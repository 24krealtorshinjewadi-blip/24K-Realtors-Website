-- Create Wishlists Table
CREATE TABLE wishlists (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    property_id UUID NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_property UNIQUE (user_id, property_id)
);

CREATE INDEX idx_wishlist_user ON wishlists(user_id);

-- Extend Leads Table with property reference
ALTER TABLE leads ADD COLUMN property_id UUID;
ALTER TABLE leads ADD CONSTRAINT fk_leads_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL;
