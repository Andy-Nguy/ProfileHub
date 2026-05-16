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

export interface ISkill {
  id: string;
  profileId: string;
  name: string;
  category: SkillCategory;
  endorsementCount: number;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
