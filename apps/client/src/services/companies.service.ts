import { apiClient, getErrorMessage } from './api.service';
import { ICompany } from '@profilehub/types';
import { toast } from 'sonner';

export const companiesAPI = {
  searchCompanies: async (query: string): Promise<ICompany[]> => {
    if (!query) return [];
    try {
      const response = await apiClient.get<ICompany[]>(`/companies/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      // Search usually doesn't show error toast to avoid noise, but we follow the style
      toast.error(`Search companies failed: ${getErrorMessage(error)}`);
      return [];
    }
  },

  createCompany: async (data: { name: string; domain?: string; file?: File }): Promise<ICompany> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.domain) {
        formData.append('domain', data.domain);
      }
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await apiClient.post<ICompany>('/companies', formData);
      toast.success('Company created successfully');
      return response.data;
    } catch (error) {
      toast.error(`Create company failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },
};
