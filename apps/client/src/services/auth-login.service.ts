import { apiClient, refreshAccessToken, getErrorMessage } from './api.service';
import { ILoginDto, IRegisterDto, IVerifyEmailDto } from '@profilehub/types';
import { toast } from 'sonner';

export const authAPI = {
  login: async ({email, password}: ILoginDto) => {
    try {
      const response = await apiClient.post('/auth/login', {email, password});
      toast.success('Login successful');
      return response.data;
    } catch (error) {
      toast.error(`Login failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  register: async ({username, email, password}: IRegisterDto) => {
    try {
      const response = await apiClient.post('/auth/register', {username, email, password});
      toast.success('Registration successful');
      return response.data;
    } catch (error) {
      toast.error(`Registration failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  verifyEmail: async ({email, code}: IVerifyEmailDto) => {
    try {
      const response = await apiClient.post('/auth/verify-email', {email, code});
      toast.success('Email verified successfully');
      return response.data;
    } catch (error) {
      toast.error(`Email verification failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  refresh: async () => {
    try {
      const accessToken = await refreshAccessToken();
      return { accessToken };
    } catch (error) {
      // Refresh usually handled by interceptor, but we add error handling if called directly
      toast.error(`Session refresh failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      toast.success('Logged out successfully');
      return response.data;
    } catch (error) {
      toast.error(`Logout failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },

  getMe: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      toast.error(`Get account info failed: ${getErrorMessage(error)}`);
      throw error;
    }
  },
};
