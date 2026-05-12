import { apiClient } from './api.service';

import { ILoginDto, IRegisterDto, IVerifyEmailDto } from '../../../../libs/shared/types/auth.types';

export const authAPI = {
  login: async ({email, password}: ILoginDto) => {
    const response = await apiClient.post('/auth/login', {email, password});
    return response.data;
  },

  register: async ({username, email, password}: IRegisterDto) => {
    const response = await apiClient.post('/auth/register', {username, email, password});
    return response.data;
  },

  verifyEmail: async ({email, code}: IVerifyEmailDto) => {
    const response = await apiClient.post('/auth/verify-email', {email, code});
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
