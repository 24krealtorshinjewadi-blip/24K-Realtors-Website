CREATE TABLE agents (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Alter leads table to add foreign key reference to assigned agent
ALTER TABLE leads ADD COLUMN assigned_agent_id UUID;

ALTER TABLE leads 
    ADD CONSTRAINT fk_leads_assigned_agent 
    FOREIGN KEY (assigned_agent_id) 
    REFERENCES agents(id) 
    ON DELETE SET NULL;

-- Index for lead lookups by assigned agent
CREATE INDEX idx_leads_assigned_agent ON leads(assigned_agent_id);
