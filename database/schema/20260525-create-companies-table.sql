-- =============================================================================
-- Migration: 20260525-create-companies-table
-- Description: Adds deduplicated companies and links experiences to companies.
-- =============================================================================

CREATE TABLE IF NOT EXISTS companies (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255)  NOT NULL,
  domain      VARCHAR(255),
  logo_url    VARCHAR(2048),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_companies_name UNIQUE (name)
);

ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS company_id UUID;

ALTER TABLE experiences
  DROP CONSTRAINT IF EXISTS fk_experiences_company_id;

ALTER TABLE experiences
  ADD CONSTRAINT fk_experiences_company_id
  FOREIGN KEY (company_id)
  REFERENCES companies(id)
  ON DELETE SET NULL;

