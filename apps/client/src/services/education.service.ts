import { apiClient, getErrorMessage } from './api.service';
import { toast } from 'sonner';

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
      toast.error(`Search education institutions failed: ${getErrorMessage(error)}`);
      return [];
    }
  },
};
