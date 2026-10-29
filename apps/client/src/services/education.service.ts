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

  uploadInstitutionLogo: async (
    institutionName: string,
    file: File,
  ): Promise<{ institutionLogoUrl: string }> => {
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      const response = await apiClient.post<{ institutionLogoUrl: string }>(
        `/storage/institution-logo?institutionName=${encodeURIComponent(institutionName)}`,
        uploadForm,
      );
      return response.data;
    } catch (error) {
      toast.error(`Upload institution logo failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },
};
