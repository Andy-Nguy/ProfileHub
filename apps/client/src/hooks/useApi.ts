import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ── Discovery Feed ──────────────────────
export function useDiscoveryFeed(page = 1, limit = 20, search = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);

  return useQuery({
    queryKey: ['discovery', page, limit, search],
    queryFn: () => fetchJson<any>(`${API}/profiles/discover?${params}`),
  });
}

// ── Profile by Username ─────────────────
export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchJson<any>(`${API}/profiles/${username}`),
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

      qc.setQueriesData({ queryKey: ['discovery'] }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((p: any) =>
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
