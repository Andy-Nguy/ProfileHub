import { useQuery, useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/auth-login.service';
import { profileAPI } from '../services/profile.service';
import { getErrorMessage } from '../services/api.service';
import { ILoginDto, IRegisterDto, IVerifyEmailDto } from '@profilehub/types';

// ── Auth ────────────────────────────────
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: ILoginDto) => {
      try {
        return await authAPI.login(credentials);
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err) || 'Login failed');
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (userData: IRegisterDto) => {
      try {
        return await authAPI.register(userData);
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err) || 'Registration failed');
      }
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (verificationData: IVerifyEmailDto) => {
      try {
        return await authAPI.verifyEmail(verificationData);
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err) || 'Email verification failed');
      }
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        return await authAPI.logout();
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err) || 'Logout failed');
      }
    },
  });
}

// ── Discovery Feed ──────────────────────
export function useDiscoveryFeed(page = 1, limit = 20, search = '') {
  return useQuery({
    queryKey: ['discovery', page, limit, search],
    queryFn: () => profileAPI.getDiscoveryFeed(page, limit, search || undefined),
    staleTime: 0,
  });
}
