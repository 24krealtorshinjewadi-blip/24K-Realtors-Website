-- Follow Up Tasks Table
CREATE TABLE follow_up_tasks (
    id UUID PRIMARY KEY,
    lead_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT fk_tasks_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_agent FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Performance Indexes
CREATE INDEX idx_tasks_lead ON follow_up_tasks(lead_id);
CREATE INDEX idx_tasks_agent ON follow_up_tasks(agent_id);
CREATE INDEX idx_tasks_status ON follow_up_tasks(status);
CREATE INDEX idx_tasks_due_date ON follow_up_tasks(due_date);
