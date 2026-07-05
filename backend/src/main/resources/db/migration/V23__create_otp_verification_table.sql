-- V23: Create table for persisting temporary OTP verification states
-- Resolves the session validation loss on container restart by shifting from in-memory map to database storage.

CREATE TABLE otp_verifications (
    temp_token VARCHAR(255) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    remember_device BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index on expires_at to allow cleanup routines
CREATE INDEX idx_otp_expires_at ON otp_verifications(expires_at);
