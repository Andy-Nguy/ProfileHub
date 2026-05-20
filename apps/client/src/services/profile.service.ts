import { apiClient, ApiError } from './api.service';
import { toast } from 'sonner';

export interface UpdateProfileDto {
  displayName?: string;
  headline?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  industry?: string | null;
  visibility?: 'public' | 'private';
}

export const profileAPI = {
  updateOnboarding: async (dto: UpdateProfileDto) => {
    try {
      const response = await apiClient.patch('/profiles/me', dto);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Update onboarding failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Update onboarding failed: Unknown Error');
      }
      throw error;
    }
  },

  getMyProfile: async () => {
    try {
      const response = await apiClient.get('/profiles/mine');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Get profile failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Get profile failed: Unknown Error');
      }
      throw error;
    }
  },

  getPublicProfile: async (username: string) => {
    try {
      const response = await apiClient.get(`/profiles/u/${username}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Get public profile failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Get public profile failed: Unknown Error');
      }
      throw error;
    }
  },

  updateProfile: async (dto: UpdateProfileDto) => {
    try {
      const response = await apiClient.patch('/profiles/me', dto);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Update profile failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Update profile failed: Unknown Error');
      }
      throw error;
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/storage/avatar', formData);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Upload avatar failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Upload avatar failed: Unknown Error');
      }
      throw error;
    }
  },

  getDiscoveryFeed: async (page = 1, limit = 20, search?: string) => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });
      const response = await apiClient.get(`/profiles/discover?${query}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Get discovery feed failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Get discovery feed failed: Unknown Error');
      }
      throw error;
    }
  },

  // ── Experiences ───────────────────────────────────────────────────
  getExperiences: async () => {
    try {
      const response = await apiClient.get('/profiles/me/experiences');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Get experiences failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Get experiences failed: Unknown Error');
      }
      throw error;
    }
  },
  addExperience: async (data: any) => {
    try {
      const response = await apiClient.post('/profiles/me/experiences', data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Add experience failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Add experience failed: Unknown Error');
      }
      throw error;
    }
  },

  // ── Educations ────────────────────────────────────────────────────
  getEducations: async () => {
    try {
      const response = await apiClient.get('/profiles/me/educations');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Get educations failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Get educations failed: Unknown Error');
      }
      throw error;
    }
  },
  addEducation: async (data: any) => {
    try {
      const response = await apiClient.post('/profiles/me/educations', data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Add education failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Add education failed: Unknown Error');
      }
      throw error;
    }
  },

  // ── Skills ────────────────────────────────────────────────────────
  getSkills: async () => {
    try {
      const response = await apiClient.get('/profiles/me/skills');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Get skills failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Get skills failed: Unknown Error');
      }
      throw error;
    }
  },
  addSkill: async (data: any) => {
    try {
      const response = await apiClient.post('/profiles/me/skills', data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Add skill failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Add skill failed: Unknown Error');
      }
      throw error;
    }
  },

  // ── Social Links ──────────────────────────────────────────────────
  getSocialLinks: async () => {
    try {
      const response = await apiClient.get('/profiles/me/social-links');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Get social links failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Get social links failed: Unknown Error');
      }
      throw error;
    }
  },
  addSocialLink: async (data: any) => {
    try {
      const response = await apiClient.post('/profiles/me/social-links', data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Add social link failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Add social link failed: Unknown Error');
      }
      throw error;
    }
  },
};
