-- ══════════════════════════════════════════════════════════════════════
-- V25 — Extend OTP verification + User auth fields for SaaS-grade login
-- ══════════════════════════════════════════════════════════════════════

-- ── otp_verifications enhancements ──────────────────────────────────
ALTER TABLE otp_verifications
    ADD COLUMN IF NOT EXISTS identifier      VARCHAR(255),
    ADD COLUMN IF NOT EXISTS identifier_type VARCHAR(10),
    ADD COLUMN IF NOT EXISTS attempt_count   INT          NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ip_address      VARCHAR(60),
    ADD COLUMN IF NOT EXISTS otp_hash        VARCHAR(255);

-- ── users: auth provider + passwordless flag ─────────────────────────
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS mobile_verified      BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS passwordless_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS auth_provider        VARCHAR(20)      DEFAULT 'LOCAL';

-- ── index for fast identifier-based OTP lookup ───────────────────────
CREATE INDEX IF NOT EXISTS idx_otp_identifier ON otp_verifications (identifier);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_verifications (expires_at);
