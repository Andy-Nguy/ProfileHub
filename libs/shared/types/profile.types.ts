import { ISkill } from './skill.types';
import { IExperience } from './experience.types';
import { IEducation } from './education.types';
import { ISocialLink } from './social.types';

export enum VisibilityTypeEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONNECTIONS_ONLY = 'connections_only',
}

export interface IProfile {
  id: string;
  userId: string;
  displayName: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  location: string | null;
  industry: string | null;
  visibility: VisibilityTypeEnum;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Relations (optional)
  skills?: ISkill[];
  experiences?: IExperience[];
  educations?: IEducation[];
  socialLinks?: ISocialLink[];
}

export interface ProfileResponse extends IProfile {
  username?: string;
  completionPercent: number;
  needsOnboarding: boolean;
  likesCount: number;
  experiences: IExperience[];
  educations: IEducation[];
  skills: ISkill[];
  socialLinks: ISocialLink[];
}

export interface DiscoveryFeedResponse {
  data: ProfileResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OnboardingStatusResponse {
  needsOnboarding: boolean;
  profileCompletion: number;
  profile: Pick<IProfile, 'id' | 'displayName' | 'headline' | 'avatarUrl' | 'visibility'> | null;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
