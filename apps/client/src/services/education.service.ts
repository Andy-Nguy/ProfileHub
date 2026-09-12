import { apiClient, ApiError } from './api.service';

export interface IEducationSearchResult {
  institution: string;
  institutionLogoUrl: string | null;
}

export const educationAPI = {
  searchEducation: async (query: string): Promise<IEducationSearchResult[]> => {
    if (!query) return [];
    try {
      const response = await apiClient.get<IEducationSearchResult[]>(
        `/education/search?q=${encodeURIComponent(query)}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Search education institutions failed', error.response?.data);
      }
      return [];
    }
  },
};
