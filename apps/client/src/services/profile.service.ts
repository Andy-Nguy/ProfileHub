import { apiClient } from './api.service';

export interface UpdateOnboardingDto {
  displayName?: string;
  headline?: string | null;
  avatarUrl?: string | null;
  visibility?: 'public' | 'private';
}

export const profileAPI = {
  updateOnboarding: async (dto: UpdateOnboardingDto) => {
    const response = await apiClient.patch('/profiles/onboarding', dto);
    return response.data;
  },

  getProfile: async (username: string) => {
    const response = await apiClient.get(`/profiles/${username}`);
    return response.data;
  },

  getDiscoveryFeed: async (page = 1, limit = 20, search?: string) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    const response = await apiClient.get(`/profiles/discover?${query}`);
    return response.data;
  },
};
