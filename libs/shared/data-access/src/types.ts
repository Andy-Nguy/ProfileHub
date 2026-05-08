// ═══════════════════════════════════════════
// ProfileHub — Shared Types & Enums
// Single source of truth for FE + BE
// ═══════════════════════════════════════════

export enum SkillCategory {
  LANGUAGE = 'language',
  FRAMEWORK = 'framework',
  TOOL = 'tool',
  DATABASE = 'database',
  CLOUD = 'cloud',
  DESIGN = 'design',
  SOFT_SKILL = 'soft_skill',
  OTHER = 'other',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum InteractionTargetType {
  PROFILE = 'profile',
  SKILL = 'skill',
}

export enum InteractionType {
  LIKE = 'like',
  ENDORSE = 'endorse',
}

export enum SocialPlatform {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  DRIBBBLE = 'dribbble',
  PERSONAL = 'personal',
}
