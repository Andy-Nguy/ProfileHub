import { ISkill } from './skill.types';
import { IExperience } from './experience.types';
import { IEducation } from './education.types';

export enum VisibilityType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONNECTIONS_ONLY = 'connections_only',
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
