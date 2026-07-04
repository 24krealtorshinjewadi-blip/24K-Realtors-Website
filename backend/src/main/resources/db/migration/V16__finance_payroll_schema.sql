-- Payslips Table
CREATE TABLE payslips (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pay_period VARCHAR(50) NOT NULL, -- e.g. "2026-07"
    base_salary DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    allowances DECIMAL(15,2) NOT NULL DEFAULT 0.00, -- HRA, DA, Special
    commissions DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    pf_deduction DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    pt_deduction DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    net_salary DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL, -- PENDING, PAID
    pdf_url VARCHAR(255),
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID,
    UNIQUE(user_id, pay_period)
);

-- Expenses Table
CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100) NOT NULL, -- TRAVEL, MEALS, MARKETING, OFFICE, OTHER
    description TEXT,
    status VARCHAR(50) NOT NULL, -- PENDING, APPROVED, REJECTED
    approved_by UUID REFERENCES users(id),
    receipt_url VARCHAR(255),
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_payslips_user ON payslips(user_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
