-- =============================================================================
-- ProfileHub PostgreSQL Schema
-- Focus: Auth & Security (Critical Foundation First)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE user_role AS ENUM (
  'user',
  'admin',
  'moderator'
);

CREATE TYPE visibility_type AS ENUM (
  'public',
  'private',
  'connections_only'
);

CREATE TYPE otp_purpose AS ENUM (
  'register',
  'reset_password'
);

-- =============================================================================
-- TABLE: users
-- =============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email VARCHAR(320) NOT NULL,
  username VARCHAR(50) NOT NULL,

  password_hash VARCHAR(255) NOT NULL,

  role user_role NOT NULL DEFAULT 'user',

  is_active BOOLEAN NOT NULL DEFAULT FALSE,

  email_verified_at TIMESTAMPTZ,

  last_login_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT uq_users_email UNIQUE (email),

  CONSTRAINT uq_users_username UNIQUE (username),

  CONSTRAINT chk_username_format
    CHECK (username ~ '^[a-zA-Z0-9._-]+$')
);

CREATE INDEX idx_users_email
ON users(email)
WHERE deleted_at IS NULL;

CREATE INDEX idx_users_username
ON users(username)
WHERE deleted_at IS NULL;

-- =============================================================================
-- TABLE: otp_codes
-- Purpose:
-- - email verification
-- - password reset
-- =============================================================================

CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email VARCHAR(320) NOT NULL,

  code_hash VARCHAR(255) NOT NULL,

  purpose otp_purpose NOT NULL,

  expires_at TIMESTAMPTZ NOT NULL,

  attempt_count INT NOT NULL DEFAULT 0,

  is_used BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_email_purpose
ON otp_codes(email, purpose)
WHERE is_used = FALSE;

-- =============================================================================
-- TABLE: refresh_tokens
-- Purpose:
-- - session persistence
-- - refresh token rotation
-- - future logout support
-- =============================================================================

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  jti UUID NOT NULL,

  token_hash TEXT NOT NULL,

  expires_at TIMESTAMPTZ NOT NULL,

  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  user_agent TEXT,

  ip_address VARCHAR(45)
);

CREATE INDEX idx_refresh_tokens_user_id
ON refresh_tokens(user_id);

CREATE INDEX idx_refresh_tokens_jti
ON refresh_tokens(jti);

-- =============================================================================
-- TABLE: profiles
-- Public profile information
-- =============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  display_name VARCHAR(100) NOT NULL,

  headline VARCHAR(220),

  avatar_url VARCHAR(2048),

  visibility visibility_type NOT NULL DEFAULT 'public',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_profiles_user_id UNIQUE(user_id)
);

-- =============================================================================
-- TODO (PHASE 2+)
-- =============================================================================

-- TODO: password_resets
-- TODO: login_attempts
-- TODO: user_sessions
-- TODO: resend_otp_tracking
-- TODO: social_connections
-- TODO: posts
-- TODO: comments
-- TODO: likes
-- TODO: projects
-- TODO: skills

-- =============================================================================
-- TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();