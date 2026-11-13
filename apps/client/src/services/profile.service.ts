import {
  CreateEducationDto,
  CreateExperienceDto,
  CreateSkillDto,
  CreateSocialLinkDto,
  UpdateProfileDto,
  UpdateOnboardingDto,
} from '@profilehub/data-access';
import {
  SuccessResponse,
  ProfileResponse,
  DiscoveryFeedResponse,
  OnboardingStatusResponse,
  UploadAvatarResponse,
} from '@profilehub/types';

export type {
  ProfileResponse,
  DiscoveryFeedResponse,
  OnboardingStatusResponse,
  UploadAvatarResponse,
};
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

  addExperience: async (data: CreateExperienceDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.post<SuccessResponse>('/profiles/me/experiences', data);
      toast.success('Experience added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add experience failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  updateExperience: async (id: string, data: CreateExperienceDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.put<SuccessResponse>(`/profiles/me/experiences/${id}`, data);
      toast.success('Experience updated successfully');
      return response.data;
    } catch (error) {
      toast.error(`Update experience failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  deleteExperience: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/profiles/me/experiences/${id}`);
      toast.success('Experience deleted successfully');
    } catch (error) {
      toast.error(`Delete experience failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  addEducation: async (data: CreateEducationDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.post<SuccessResponse>('/profiles/me/educations', data);
      toast.success('Education added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add education failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  updateEducation: async (id: string, data: CreateEducationDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.put<SuccessResponse>(`/profiles/me/educations/${id}`, data);
      toast.success('Education updated successfully');
      return response.data;
    } catch (error) {
      toast.error(`Update education failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  deleteEducation: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/profiles/me/educations/${id}`);
      toast.success('Education deleted successfully');
    } catch (error) {
      toast.error(`Delete education failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  addSkill: async (data: CreateSkillDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.post<SuccessResponse>('/profiles/me/skills', data);
      toast.success('Skill added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add skill failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  updateSkill: async (id: string, data: CreateSkillDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.put<SuccessResponse>(`/profiles/me/skills/${id}`, data);
      toast.success('Skill updated successfully');
      return response.data;
    } catch (error) {
      toast.error(`Update skill failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  deleteSkill: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/profiles/me/skills/${id}`);
      toast.success('Skill deleted successfully');
    } catch (error) {
      toast.error(`Delete skill failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  addSocialLink: async (data: CreateSocialLinkDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.post<SuccessResponse>('/profiles/me/social-links', data);
      toast.success('Social link added successfully');
      return response.data;
    } catch (error) {
      toast.error(`Add social link failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  updateSocialLink: async (id: string, data: CreateSocialLinkDto): Promise<SuccessResponse> => {
    try {
      const response = await apiClient.put<SuccessResponse>(`/profiles/me/social-links/${id}`, data);
      toast.success('Social link updated successfully');
      return response.data;
    } catch (error) {
      toast.error(`Update social link failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  deleteSocialLink: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/profiles/me/social-links/${id}`);
      toast.success('Social link deleted successfully');
    } catch (error) {
      toast.error(`Delete social link failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },
};
