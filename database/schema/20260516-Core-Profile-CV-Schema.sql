-- =============================================================================
-- Migration: 20260516-Core-Profile-CV-Schema
-- Description: Expands the profiles table and creates experiences, educations,
--              skills, and social_links tables to support the full CV system.
--              (Designed to be applied on top of 20260505-Initial-schema.sql)
-- =============================================================================

-- ── 1. Add new columns to profiles ──────────────────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bio          TEXT,
  ADD COLUMN IF NOT EXISTS cover_url    VARCHAR(2048),
  ADD COLUMN IF NOT EXISTS location     VARCHAR(150),
  ADD COLUMN IF NOT EXISTS industry     VARCHAR(100);

-- Discovery Feed performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_location
  ON profiles (location)
  WHERE visibility = 'public';

CREATE INDEX IF NOT EXISTS idx_profiles_industry
  ON profiles (industry)
  WHERE visibility = 'public';

-- ── 2. Create social_links table ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS social_links (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform    VARCHAR(50)   NOT NULL, -- e.g., 'github', 'linkedin', 'website', 'twitter'
  url         VARCHAR(2048) NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  
  CONSTRAINT uq_social_links_profile_platform UNIQUE (profile_id, platform)
);

-- Add updated_at trigger for social_links
DROP TRIGGER IF EXISTS trg_social_links_updated_at ON social_links;
CREATE TRIGGER trg_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── 3. Create experiences table ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS experiences (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_title       VARCHAR(150)  NOT NULL,
  company_name    VARCHAR(150)  NOT NULL,
  location        VARCHAR(150),
  employment_type VARCHAR(50),  -- e.g., 'FULL_TIME', 'PART_TIME', 'CONTRACT'
  start_date      DATE          NOT NULL,
  end_date        DATE,
  is_current      BOOLEAN       NOT NULL DEFAULT FALSE,
  description     TEXT,
  display_order   SMALLINT      NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS trg_experiences_updated_at ON experiences;
CREATE TRIGGER trg_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index for ordered retrieval
CREATE INDEX IF NOT EXISTS idx_experiences_profile_id
  ON experiences (profile_id, display_order);

-- ── 4. Create educations table ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS educations (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution_name  VARCHAR(255)  NOT NULL,
  degree            VARCHAR(100),
  field_of_study    VARCHAR(100),
  start_date        DATE          NOT NULL,
  end_date          DATE,
  is_current        BOOLEAN       NOT NULL DEFAULT FALSE,
  description       TEXT,
  display_order     SMALLINT      NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS trg_education_updated_at ON educations;
CREATE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON educations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index
CREATE INDEX IF NOT EXISTS idx_education_profile_id
  ON educations (profile_id, display_order);

-- ── 5. Create skills table ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS skills (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name              VARCHAR(100)  NOT NULL,
  category          VARCHAR(50),  -- e.g., 'frontend', 'backend', 'other'
  endorsement_count INT           NOT NULL DEFAULT 0,
  display_order     SMALLINT      NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS trg_skills_updated_at ON skills;
CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index
CREATE INDEX IF NOT EXISTS idx_skills_profile_id
  ON skills (profile_id, display_order);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
