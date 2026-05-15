-- =============================================================================
-- IMPORTANT
-- -----------------------------------------------------------------------------
-- This schema is an INITIAL ARCHITECTURAL REFERENCE only.
--
-- It is NOT the production source of truth.
-- Actual implementation may differ based on:
-- - evolving business requirements
-- - performance considerations
-- - scalability improvements
-- - security requirements
-- - backend architecture decisions
--
-- AI agents and developers should:
-- - use this schema as conceptual guidance
-- - NOT blindly replicate all structures
-- - adapt, normalize, refactor, or redesign where appropriate
-- - prioritize current codebase architecture over this document
-- =============================================================================

-- =============================================================================
-- ProHub PostgreSQL Schema
-- Version: 1.0.0
-- Description: Full DDL for the ProHub professional portfolio platform.
--              Includes soft-delete, audit columns, and Discovery Feed indexes.
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE user_role         AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE visibility_type   AS ENUM ('public', 'private', 'connections_only');
CREATE TYPE employment_type   AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship', 'volunteer');
CREATE TYPE project_status    AS ENUM ('in_progress', 'completed', 'archived', 'concept');
CREATE TYPE interaction_type  AS ENUM ('profile_like', 'skill_endorsement');
CREATE TYPE target_type       AS ENUM ('profile', 'user_skill');
CREATE TYPE auth_provider     AS ENUM ('local', 'google', 'github', 'linkedin');
CREATE TYPE skill_category    AS ENUM (
  'programming_language', 'framework', 'database', 'devops',
  'design', 'soft_skill', 'language', 'tool', 'other'
);

-- =============================================================================
-- TABLE: users
-- Core identity table. Slug drives the public URL: prohub.com/u/{slug}
-- =============================================================================

CREATE TABLE users (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email               VARCHAR(320)  NOT NULL,
  username            VARCHAR(50)   NOT NULL,
  slug                VARCHAR(100)  NOT NULL,   -- e.g. "sarah-jenkins"
  password_hash       VARCHAR(255),             -- NULL for OAuth-only users
  role                user_role     NOT NULL DEFAULT 'user',
  is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
  email_verified_at   TIMESTAMPTZ,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ,              -- soft delete

  CONSTRAINT uq_users_email    UNIQUE (email),
  CONSTRAINT uq_users_username UNIQUE (username),
  CONSTRAINT uq_users_slug     UNIQUE (slug),
  CONSTRAINT chk_slug_format   CHECK  (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_users_slug       ON users (slug)       WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email      ON users (email)      WHERE deleted_at IS NULL;
CREATE INDEX idx_users_is_active  ON users (is_active)  WHERE deleted_at IS NULL;

COMMENT ON TABLE  users           IS 'Core identity table. One row per registered user.';
COMMENT ON COLUMN users.slug      IS 'URL-safe identifier: prohub.com/u/{slug}. Unique and immutable after first set.';
COMMENT ON COLUMN users.deleted_at IS 'NULL = active account. Non-NULL = soft-deleted.';

-- =============================================================================
-- TABLE: auth_profiles
-- Supports both local (password) auth and OAuth providers (Google, GitHub, etc.)
-- Relationship: 1:1 with users (one primary auth entry per user).
-- =============================================================================

CREATE TABLE auth_profiles (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  provider          auth_provider NOT NULL DEFAULT 'local',
  provider_id       VARCHAR(255),             -- OAuth provider's user ID
  access_token      TEXT,
  refresh_token     TEXT,
  token_expires_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_auth_profiles_user_provider UNIQUE (user_id, provider)
);

CREATE INDEX idx_auth_profiles_user_id    ON auth_profiles (user_id);
CREATE INDEX idx_auth_profiles_provider   ON auth_profiles (provider, provider_id);

COMMENT ON TABLE auth_profiles IS '1:1 with users. Tracks auth method (password or OAuth). One row per provider per user.';

-- =============================================================================
-- TABLE: profiles
-- The public-facing "Live CV" card. Linked 1:1 to users.
-- Stores the bio, avatar, cover, headline and discovery metadata.
-- =============================================================================

CREATE TABLE profiles (
  id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID             NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  headline        VARCHAR(220),
  bio             TEXT,
  avatar_url      VARCHAR(2048),
  cover_url       VARCHAR(2048),
  location        VARCHAR(150),    -- Discovery Feed filter
  website_url     VARCHAR(2048),
  github_url      VARCHAR(2048),
  linkedin_url    VARCHAR(2048),
  industry        VARCHAR(100),    -- Discovery Feed filter
  university      VARCHAR(200),    -- Discovery Feed filter
  visibility      visibility_type  NOT NULL DEFAULT 'public',
  created_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,

  CONSTRAINT uq_profiles_user_id UNIQUE (user_id)
);

-- Discovery Feed performance indexes
CREATE INDEX idx_profiles_location   ON profiles (location)  WHERE deleted_at IS NULL AND visibility = 'public';
CREATE INDEX idx_profiles_industry   ON profiles (industry)  WHERE deleted_at IS NULL AND visibility = 'public';
CREATE INDEX idx_profiles_university ON profiles (university) WHERE deleted_at IS NULL AND visibility = 'public';
CREATE INDEX idx_profiles_visibility ON profiles (visibility) WHERE deleted_at IS NULL;

COMMENT ON TABLE  profiles            IS '1:1 with users. The public "Live CV" profile page.';
COMMENT ON COLUMN profiles.industry   IS 'Discovery filter. Denormalized string for fast search (e.g. "Software Engineering").';
COMMENT ON COLUMN profiles.university IS 'Discovery filter. Tracks the most recent/primary institution.';

-- =============================================================================
-- TABLE: experiences
-- Work timeline entries. Many-to-one with profiles.
-- =============================================================================

CREATE TABLE experiences (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID            NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  company_name      VARCHAR(255)    NOT NULL,
  job_title         VARCHAR(255)    NOT NULL,
  employment_type   employment_type NOT NULL DEFAULT 'full_time',
  description       TEXT,
  location          VARCHAR(150),
  start_date        DATE            NOT NULL,
  end_date          DATE,
  is_current        BOOLEAN         NOT NULL DEFAULT FALSE,
  display_order     SMALLINT        NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ,

  CONSTRAINT chk_experience_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT chk_current_no_end   CHECK (NOT (is_current = TRUE AND end_date IS NOT NULL))
);

CREATE INDEX idx_experiences_profile_id ON experiences (profile_id, display_order) WHERE deleted_at IS NULL;

COMMENT ON TABLE  experiences              IS 'Work history entries, many per profile. Ordered by display_order DESC.';
COMMENT ON COLUMN experiences.is_current   IS 'TRUE if this is the user''s current position. Enforces NULL end_date.';
COMMENT ON COLUMN experiences.display_order IS 'Manual sort order. Lower = shown first. Typically mirrors reverse-chronological.';

-- =============================================================================
-- TABLE: education
-- Academic history. Many-to-one with profiles.
-- =============================================================================

CREATE TABLE education (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID        NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  institution_name  VARCHAR(255) NOT NULL,
  degree            VARCHAR(255),
  field_of_study    VARCHAR(255),
  description       TEXT,
  start_date        DATE        NOT NULL,
  end_date          DATE,
  is_current        BOOLEAN     NOT NULL DEFAULT FALSE,
  display_order     SMALLINT    NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ,

  CONSTRAINT chk_education_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_education_profile_id ON education (profile_id, display_order) WHERE deleted_at IS NULL;
-- Discovery: search by university name (supports ILIKE prefix searches)
CREATE INDEX idx_education_institution ON education (institution_name) WHERE deleted_at IS NULL;

COMMENT ON TABLE education IS 'Academic history entries, many per profile.';

-- =============================================================================
-- TABLE: skills
-- Central, deduplicated skill library. All users reference this master list.
-- =============================================================================

CREATE TABLE skills (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100)    NOT NULL,
  slug          VARCHAR(100)    NOT NULL,
  category      skill_category  NOT NULL DEFAULT 'other',
  icon_url      VARCHAR(2048),
  usage_count   INT             NOT NULL DEFAULT 0,  -- denormalized counter for sort
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_skills_name UNIQUE (name),
  CONSTRAINT uq_skills_slug UNIQUE (slug)
);

CREATE INDEX idx_skills_category    ON skills (category);
CREATE INDEX idx_skills_usage_count ON skills (usage_count DESC);
-- Full-text search on skill name for autocomplete
CREATE INDEX idx_skills_name_trgm   ON skills USING gin (name gin_trgm_ops);

COMMENT ON TABLE  skills             IS 'Master skill library. Skills are shared across all users.';
COMMENT ON COLUMN skills.usage_count IS 'Denormalized count of user_skills rows. Increment on add, decrement on remove.';

-- =============================================================================
-- TABLE: user_skills
-- Junction table: N:M between profiles and skills.
-- Tracks the per-user proficiency level and the aggregated endorsement count.
-- =============================================================================

CREATE TABLE user_skills (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID        NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  skill_id          UUID        NOT NULL REFERENCES skills  (id) ON DELETE CASCADE,
  proficiency_level SMALLINT    NOT NULL DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
  endorsement_count INT         NOT NULL DEFAULT 0,  -- denormalized for O(1) reads
  display_order     SMALLINT    NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_user_skills_profile_skill UNIQUE (profile_id, skill_id)
);

-- Discovery Feed: find profiles that have a specific skill
CREATE INDEX idx_user_skills_skill_id    ON user_skills (skill_id);
CREATE INDEX idx_user_skills_profile_id  ON user_skills (profile_id, display_order);

COMMENT ON TABLE  user_skills                    IS 'N:M junction: profiles ↔ skills. One row per skill per profile.';
COMMENT ON COLUMN user_skills.endorsement_count  IS 'Cached count from interactions. Avoids expensive COUNT() on reads.';
COMMENT ON COLUMN user_skills.proficiency_level  IS '1=Beginner 2=Elementary 3=Intermediate 4=Advanced 5=Expert.';

-- =============================================================================
-- TABLE: projects
-- Portfolio showcase. Many-to-one with profiles.
-- =============================================================================

CREATE TABLE projects (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID            NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  title           VARCHAR(255)    NOT NULL,
  description     TEXT,
  project_url     VARCHAR(2048),
  repo_url        VARCHAR(2048),
  thumbnail_url   VARCHAR(2048),
  status          project_status  NOT NULL DEFAULT 'completed',
  start_date      DATE,
  end_date        DATE,
  is_featured     BOOLEAN         NOT NULL DEFAULT FALSE,
  display_order   SMALLINT        NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,

  CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_projects_profile_id  ON projects (profile_id, is_featured, display_order) WHERE deleted_at IS NULL;

COMMENT ON TABLE  projects           IS 'Portfolio projects. Many per profile.';
COMMENT ON COLUMN projects.is_featured IS 'TRUE = pinned to top of the Project Showcase section.';

-- =============================================================================
-- TABLE: project_skills
-- Junction table: N:M between projects and skills (tech stack tagging).
-- =============================================================================

CREATE TABLE project_skills (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID  NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  skill_id    UUID  NOT NULL REFERENCES skills   (id) ON DELETE CASCADE,

  CONSTRAINT uq_project_skills UNIQUE (project_id, skill_id)
);

CREATE INDEX idx_project_skills_project_id ON project_skills (project_id);
CREATE INDEX idx_project_skills_skill_id   ON project_skills (skill_id);

COMMENT ON TABLE project_skills IS 'N:M junction: projects ↔ skills. Tags the tech stack used in each project.';

-- =============================================================================
-- TABLE: interactions
-- Polymorphic table for all social actions (profile likes + skill endorsements).
-- Unique constraint on (actor_id, target_type, target_id, interaction_type)
-- prevents duplicate endorsements at the database level.
-- =============================================================================

CREATE TABLE interactions (
  id                UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id          UUID              NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  target_type       target_type       NOT NULL,
  target_id         UUID              NOT NULL,  -- references profiles.id OR user_skills.id
  interaction_type  interaction_type  NOT NULL,
  created_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ,                 -- soft delete = "un-like" / "un-endorse"

  -- One like/endorsement per actor per target
  CONSTRAINT uq_interaction UNIQUE (actor_id, target_type, target_id, interaction_type)
);

CREATE INDEX idx_interactions_actor_id   ON interactions (actor_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_interactions_target     ON interactions (target_type, target_id) WHERE deleted_at IS NULL;

COMMENT ON TABLE  interactions             IS 'Polymorphic social layer. Covers profile likes and skill endorsements.';
COMMENT ON COLUMN interactions.target_type IS 'profile = like on a profile; user_skill = endorsement on a specific skill.';
COMMENT ON COLUMN interactions.target_id   IS 'FK to profiles.id when target_type=profile, or user_skills.id when target_type=user_skill.';
COMMENT ON COLUMN interactions.deleted_at  IS 'Soft delete = user withdrew their like/endorsement. Count queries filter WHERE deleted_at IS NULL.';

-- =============================================================================
-- TRIGGERS: auto-update updated_at on row modification
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at        BEFORE UPDATE ON users        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_profiles_updated_at     BEFORE UPDATE ON profiles     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_experiences_updated_at  BEFORE UPDATE ON experiences  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_education_updated_at    BEFORE UPDATE ON education    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_user_skills_updated_at  BEFORE UPDATE ON user_skills  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_projects_updated_at     BEFORE UPDATE ON projects     FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- TRIGGER: keep skills.usage_count in sync with user_skills inserts/deletes
-- =============================================================================

CREATE OR REPLACE FUNCTION sync_skill_usage_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF    TG_OP = 'INSERT' THEN
    UPDATE skills SET usage_count = usage_count + 1 WHERE id = NEW.skill_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE skills SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.skill_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_skill_usage
  AFTER INSERT OR DELETE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION sync_skill_usage_count();

-- =============================================================================
-- DISCOVERY FEED HELPER VIEW
-- Pre-joins profiles with their top skills for the masonry grid query.
-- Filter by location, industry, university, or skill name via this view.
-- =============================================================================

CREATE VIEW v_discovery_feed AS
SELECT
  p.id                AS profile_id,
  u.slug              AS user_slug,
  u.username,
  p.headline,
  p.avatar_url,
  p.location,
  p.industry,
  p.university,
  p.visibility,
  -- aggregated top-5 skills as a JSON array for single-query card rendering
  (
    SELECT json_agg(json_build_object('name', s.name, 'category', s.category, 'endorsements', us.endorsement_count)
           ORDER BY us.endorsement_count DESC, us.display_order)
    FROM   user_skills us
    JOIN   skills s ON s.id = us.skill_id
    WHERE  us.profile_id = p.id
    LIMIT  5
  ) AS top_skills
FROM  profiles p
JOIN  users    u ON u.id = p.user_id
WHERE p.deleted_at IS NULL
  AND u.deleted_at IS NULL
  AND u.is_active   = TRUE
  AND p.visibility  = 'public';

COMMENT ON VIEW v_discovery_feed IS 'Materialized-ready view powering the Discovery Feed masonry grid. Filter by location, industry, university, or query top_skills JSON.';

-- =============================================================================
-- EXAMPLE DISCOVERY FEED QUERIES
-- =============================================================================

-- Find all profiles with a specific skill:
--   SELECT * FROM v_discovery_feed
--   WHERE  top_skills @> '[{"name":"PostgreSQL"}]';

-- Find by location + industry:
--   SELECT * FROM v_discovery_feed
--   WHERE  location ILIKE '%Ho Chi Minh%'
--   AND    industry = 'Software Engineering';

-- Find by university (partial match):
--   SELECT * FROM v_discovery_feed
--   WHERE  university ILIKE '%HCMUT%';