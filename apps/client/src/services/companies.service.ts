import { apiClient, ApiError } from './api.service';
import { ICompany } from '@profilehub/types';
import { toast } from 'sonner';

export const companiesAPI = {
  searchCompanies: async (query: string): Promise<ICompany[]> => {
    if (!query) return [];
    try {
      const response = await apiClient.get<ICompany[]>(`/companies/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Search companies failed', error.response?.data);
      }
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
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.response?.data?.message || error.message;
        const displayedMessage = Array.isArray(errorMessage) ? errorMessage.join(',') : errorMessage;
        toast.error(`Create company failed: ${displayedMessage || 'Unknown Error'}`);
      } else {
        toast.error('Create company failed: Unknown Error');
      }
      throw error;
    }
  },
};
