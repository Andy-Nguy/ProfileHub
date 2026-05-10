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

export enum VisibilityType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONNECTIONS_ONLY = 'connections_only',
}

// ── Shared Interfaces ──────────────────────────────────────────────────

export interface ISkill {
  id: string;
  profileId: string;
  name: string;
  category: SkillCategory;
  endorsementCount: number;
  createdAt: string | Date;
}

export interface IExperience {
  id: string;
  profileId: string;
  title: string;
  company: string;
  location: string | null;
  employmentType: EmploymentType;
  startDate: string | Date;
  endDate: string | Date | null;
  isCurrent: boolean;
  description: string;
  createdAt: string | Date;
}

export interface IEducation {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | Date;
  endDate: string | Date | null;
  isCurrent: boolean;
  description: string | null;
  createdAt: string | Date;
}

export interface IProfile {
  id: string;
  userId: string;
  displayName: string;
  headline: string | null;
  avatarUrl: string | null;
  visibility: VisibilityType;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Relations (optional)
  skills?: ISkill[];
  experiences?: IExperience[];
  educations?: IEducation[];
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
