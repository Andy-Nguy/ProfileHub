import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/auth-login.service';
import { ILoginDto, IRegisterDto, IVerifyEmailDto } from '@profilehub/types';
import { DiscoveryFeedResponse, ProfileResponse } from '../services/profile.service';

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

// ── Profile by Username ─────────────────
export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchJson<ProfileResponse>(`${API}/profiles/${username}`),
    enabled: !!username,
  });
}

// ── Toggle Like (Optimistic) ────────────
export function useToggleLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const res = await fetch(`${API}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'profile',
          targetId: profileId,
          interactionType: 'like',
        }),
      });
      return res.json();
    },
    onMutate: async (profileId) => {
      await qc.cancelQueries({ queryKey: ['discovery'] });
      const prev = qc.getQueriesData({ queryKey: ['discovery'] });

      qc.setQueriesData<DiscoveryFeedResponse>({ queryKey: ['discovery'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((p) =>
            p.id === profileId ? { ...p, likesCount: p.likesCount + 1 } : p,
          ),
        };
      });

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      ctx?.prev?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['discovery'] });
    },
  });
}

