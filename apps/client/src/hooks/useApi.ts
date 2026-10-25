import { useQuery, useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/auth-login.service';
import { ILoginDto, IRegisterDto, IVerifyEmailDto } from '@profilehub/types';
import { DiscoveryFeedResponse } from '../services/profile.service';

const API = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ── Auth ────────────────────────────────
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: ILoginDto) => {
      try {
        return await authAPI.login(credentials);
      } catch (err: any) {
        throw new Error(err.message || 'Login failed');
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (userData: IRegisterDto) => {
      try {
        return await authAPI.register(userData);
      } catch (err: any) {
        throw new Error(err.message || 'Registration failed');
      }
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (verificationData: IVerifyEmailDto) => {
      try {
        return await authAPI.verifyEmail(verificationData);
      } catch (err: any) {
        throw new Error(err.message || 'Email verification failed');
      }
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        return await authAPI.logout();
      } catch (err: any) {
        throw new Error(err.message || 'Logout failed');
      }
    },
  });
}

// ── Discovery Feed ──────────────────────
export function useDiscoveryFeed(page = 1, limit = 20, search = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);

  return useQuery({
    queryKey: ['discovery', page, limit, search],
    queryFn: () => fetchJson<DiscoveryFeedResponse>(`${API}/profiles/discover?${params}`),
    staleTime: 0,
  });
}
