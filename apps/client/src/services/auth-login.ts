import { apiClient } from './api.service';

// You can create a shared DTO file later if you want strict typing across monorepo.
// For now, these interfaces define the expected payload/response for the current BE endpoints.

export interface ILoginDto {
  email: string;
  password: string;
}

export interface IRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface IVerifyEmailDto {
  email: string;
  code: string;
}

export const authAPI = {
  login: async (data: ILoginDto) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: IRegisterDto) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  verifyEmail: async (data: IVerifyEmailDto) => {
    const response = await apiClient.post('/auth/verify-email', data);
    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
