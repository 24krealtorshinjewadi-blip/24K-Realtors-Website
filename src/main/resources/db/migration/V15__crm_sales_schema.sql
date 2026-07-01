-- Site Visits Table
CREATE TABLE site_visits (
    id UUID PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    assigned_user_id UUID REFERENCES users(id),
    visit_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL, -- SCHEDULED, COMPLETED, CANCELLED
    feedback TEXT,
    checked_in_lat DOUBLE PRECISION,
    checked_in_lon DOUBLE PRECISION,
    checked_in_time TIMESTAMP,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    assigned_user_id UUID REFERENCES users(id),
    booking_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 2.00, -- 2% standard
    commission_earned DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL, -- PENDING, APPROVED, AGREED, CANCELLED
    agreement_url VARCHAR(255),
    payment_received BOOLEAN NOT NULL DEFAULT FALSE,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID
);

-- Lead Activities Table (Timeline, Calls, Emails logs)
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- CALL, EMAIL, MEETING, NOTE, SYSTEM
    subject VARCHAR(255) NOT NULL,
    details TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_site_visits_lead ON site_visits(lead_id);
CREATE INDEX idx_bookings_lead ON bookings(lead_id);
CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);
