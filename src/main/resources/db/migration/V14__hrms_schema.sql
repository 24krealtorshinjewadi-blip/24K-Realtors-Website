CREATE TABLE attendance (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    check_in_lat DOUBLE PRECISION,
    check_in_lon DOUBLE PRECISION,
    check_out_lat DOUBLE PRECISION,
    check_out_lon DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL, -- PRESENT, ABSENT, LATE, HALF_DAY
    late BOOLEAN NOT NULL DEFAULT FALSE,
    early_exit BOOLEAN NOT NULL DEFAULT FALSE,
    overtime_minutes INT NOT NULL DEFAULT 0,
    total_breaks_duration_minutes INT NOT NULL DEFAULT 0,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID,
    UNIQUE(user_id, date)
);

CREATE TABLE attendance_breaks (
    id UUID PRIMARY KEY,
    attendance_id UUID NOT NULL REFERENCES attendance(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL, -- CASUAL, SICK, EARNED, COMP_OFF
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL, -- PENDING, APPROVED, REJECTED
    approved_by UUID REFERENCES users(id),
    approved_date TIMESTAMP,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE leave_balances (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    casual_leaves DECIMAL(5,2) NOT NULL DEFAULT 12.00,
    sick_leaves DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    earned_leaves DECIMAL(5,2) NOT NULL DEFAULT 15.00,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 0,
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
