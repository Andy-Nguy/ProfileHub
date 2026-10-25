import {
  CreateEducationDto,
  CreateExperienceDto,
  CreateSkillDto,
  CreateSocialLinkDto,
  UpdateProfileDto,
  UpdateOnboardingDto,
} from '@profilehub/data-access';
import {
  IEducation,
  IExperience,
  IProfile,
  ISkill,
  ISocialLink,
  VisibilityTypeEnum,
  ProfileResponse,
  DiscoveryFeedResponse,
  OnboardingStatusResponse,
  UploadAvatarResponse,
} from '@profilehub/types';
import { apiClient, getErrorMessage } from './api.service';
import { toast } from 'sonner';

export const profileAPI = {
  updateOnboarding: async (dto: UpdateOnboardingDto): Promise<OnboardingStatusResponse> => {
    try {
      const response = await apiClient.patch<OnboardingStatusResponse>('/profiles/onboarding', dto);
      toast.success('Onboarding status updated successfully');
      return response.data;
    } catch (error) {
      toast.error(`Update onboarding failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  getMyProfile: async () => {
    try {
      const response = await apiClient.get('/profiles/mine');
      return response.data;
    } catch (error) {
      toast.error(`Get profile failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  getPublicProfile: async (username: string): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.get<ProfileResponse>(`/profiles/u/${username}`);
      return response.data;
    } catch (error) {
      toast.error(`Get public profile failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<ProfileResponse> => {
    try {
      const response = await apiClient.patch<ProfileResponse>('/profiles/me', dto);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      toast.error(`Update profile failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<UploadAvatarResponse>('/storage/avatar', formData);
      toast.success('Avatar uploaded successfully');
      return response.data;
    } catch (error) {
      toast.error(`Upload avatar failed: ${getErrorMessage(error)}`);
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
      toast.error(`Get discovery feed failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  getExperiences: async (): Promise<IExperience[]> => {
    try {
      const response = await apiClient.get<IExperience[]>('/profiles/me/experiences');
      return response.data;
    } catch (error) {
      toast.error(`Get experiences failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  addExperience: async (data: CreateExperienceDto): Promise<IExperience> => {
    try {
      const response = await apiClient.post<IExperience>('/profiles/me/experiences', data);
      toast.success('Experience added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add experience failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  getEducations: async (): Promise<IEducation[]> => {
    try {
      const response = await apiClient.get<IEducation[]>('/profiles/me/educations');
      return response.data;
    } catch (error) {
      toast.error(`Get educations failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  addEducation: async (data: CreateEducationDto): Promise<IEducation> => {
    try {
      const response = await apiClient.post<IEducation>('/profiles/me/educations', data);
      toast.success('Education added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add education failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  getSkills: async (): Promise<ISkill[]> => {
    try {
      const response = await apiClient.get<ISkill[]>('/profiles/me/skills');
      return response.data;
    } catch (error) {
      toast.error(`Get skills failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  addSkill: async (data: CreateSkillDto): Promise<ISkill> => {
    try {
      const response = await apiClient.post<ISkill>('/profiles/me/skills', data);
      toast.success('Skill added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add skill failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  getSocialLinks: async (): Promise<ISocialLink[]> => {
    try {
      const response = await apiClient.get<ISocialLink[]>('/profiles/me/social-links');
      return response.data;
    } catch (error) {
      toast.error(`Get social links failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  addSocialLink: async (data: CreateSocialLinkDto): Promise<ISocialLink> => {
    try {
      const response = await apiClient.post<ISocialLink>('/profiles/me/social-links', data);
      toast.success('Social link added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add social link failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },
};
