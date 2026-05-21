import { toast } from 'sonner';
import {
  CreateEducationDto,
  CreateExperienceDto,
  CreateSkillDto,
  CreateSocialLinkDto,
} from '@profilehub/data-access';
import {
  IEducation,
  IExperience,
  IProfile,
  ISkill,
  ISocialLink,
  VisibilityTypeEnum,
} from '@profilehub/types';
import { apiClient, ApiError } from './api.service';

export interface UpdateProfileDto {
  displayName?: string;
  headline?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  location?: string | null;
  industry?: string | null;
  visibility?: VisibilityTypeEnum;
}

export interface UpdateOnboardingDto extends UpdateProfileDto {}

export interface OnboardingStatusResponse {
  needsOnboarding: boolean;
  profileCompletion: number;
  profile: Pick<IProfile, 'id' | 'displayName' | 'headline' | 'avatarUrl' | 'visibility'> | null;
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

export interface UploadAvatarResponse {
  avatarUrl: string;
}

function showApiError(prefix: string, error: unknown) {
  if (error instanceof ApiError) {
    const errorMessage = error.response?.data?.message || error.message;
    const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
    toast.error(`${prefix}: ${displayedMessage || 'Unknown Error'}`);
    return;
  }

  toast.error(`${prefix}: Unknown Error`);
}

export const profileAPI = {
  updateOnboarding: async (dto: UpdateOnboardingDto): Promise<OnboardingStatusResponse> => {
    try {
      const response = await apiClient.patch<OnboardingStatusResponse>('/profiles/onboarding', dto);
      return response.data;
    } catch (error) {
      showApiError('Update onboarding failed', error);
      throw error;
    }
  },

  getMyProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.get<ProfileResponse>('/profiles/me');
      return response.data;
    } catch (error) {
      showApiError('Get profile failed', error);
      throw error;
    }
  },

  getPublicProfile: async (username: string): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.get<ProfileResponse>(`/profiles/u/${username}`);
      return response.data;
    } catch (error) {
      showApiError('Get public profile failed', error);
      throw error;
    }
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.patch<ProfileResponse>('/profiles/me', dto);
      return response.data;
    } catch (error) {
      showApiError('Update profile failed', error);
      throw error;
    }
  },

  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<UploadAvatarResponse>('/storage/avatar', formData);
      return response.data;
    } catch (error) {
      showApiError('Upload avatar failed', error);
      throw error;
    }
  },

  getDiscoveryFeed: async (
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<DiscoveryFeedResponse> => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });
      const response = await apiClient.get<DiscoveryFeedResponse>(`/profiles/discover?${query}`);
      return response.data;
    } catch (error) {
      showApiError('Get discovery feed failed', error);
      throw error;
    }
  },

  getExperiences: async (): Promise<IExperience[]> => {
    try {
      const response = await apiClient.get<IExperience[]>('/profiles/me/experiences');
      return response.data;
    } catch (error) {
      showApiError('Get experiences failed', error);
      throw error;
    }
  },

  addExperience: async (data: CreateExperienceDto): Promise<IExperience> => {
    try {
      const response = await apiClient.post<IExperience>('/profiles/me/experiences', data);
      return response.data;
    } catch (error) {
      showApiError('Add experience failed', error);
      throw error;
    }
  },

  getEducations: async (): Promise<IEducation[]> => {
    try {
      const response = await apiClient.get<IEducation[]>('/profiles/me/educations');
      return response.data;
    } catch (error) {
      showApiError('Get educations failed', error);
      throw error;
    }
  },

  addEducation: async (data: CreateEducationDto): Promise<IEducation> => {
    try {
      const response = await apiClient.post<IEducation>('/profiles/me/educations', data);
      return response.data;
    } catch (error) {
      showApiError('Add education failed', error);
      throw error;
    }
  },

  getSkills: async (): Promise<ISkill[]> => {
    try {
      const response = await apiClient.get<ISkill[]>('/profiles/me/skills');
      return response.data;
    } catch (error) {
      showApiError('Get skills failed', error);
      throw error;
    }
  },

  addSkill: async (data: CreateSkillDto): Promise<ISkill> => {
    try {
      const response = await apiClient.post<ISkill>('/profiles/me/skills', data);
      return response.data;
    } catch (error) {
      showApiError('Add skill failed', error);
      throw error;
    }
  },

  getSocialLinks: async (): Promise<ISocialLink[]> => {
    try {
      const response = await apiClient.get<ISocialLink[]>('/profiles/me/social-links');
      return response.data;
    } catch (error) {
      showApiError('Get social links failed', error);
      throw error;
    }
  },

  addSocialLink: async (data: CreateSocialLinkDto): Promise<ISocialLink> => {
    try {
      const response = await apiClient.post<ISocialLink>('/profiles/me/social-links', data);
      return response.data;
    } catch (error) {
      showApiError('Add social link failed', error);
      throw error;
    }
  },
};
