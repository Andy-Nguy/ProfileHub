-- Auth Hardening Migration: 2026-09-07
-- Implements requirements for Phase 1, 3, 4, 5 of the Auth Hardening Plan.

BEGIN;

-- 1. Refresh Token Lineage & Revocation
-- Add columns to support token rotation lineage and detailed revocation audit.
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS replaced_by_jti UUID;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS revoked_reason TEXT;

-- Ensure JTI is unique to prevent duplicate session identifiers.
-- Since we can't use ADD CONSTRAINT IF NOT EXISTS in some psql versions, we check first.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_refresh_tokens_jti') THEN
        ALTER TABLE refresh_tokens ADD CONSTRAINT uq_refresh_tokens_jti UNIQUE (jti);
    END IF;
END $$;

-- Partial index for the per-request auth check in JwtStrategy.
-- This allows very fast lookups for active sessions only.
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_active ON refresh_tokens(jti) WHERE is_revoked = FALSE;

-- 2. User Security Auditing
-- Track password changes to allow UI display and session invalidation.
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

-- 3. OTP Resilience
-- Add resend tracking to support cooldowns and hard caps.
ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS resend_count INT NOT NULL DEFAULT 0;
ALTER TABLE otp_codes ADD COLUMN IF NOT EXISTS last_sent_at TIMESTAMPTZ;

COMMIT;
