import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDiscoveryFeed } from '../hooks/useApi';
import { ProfileCard } from '../components/ProfileCard';

export const DiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useDiscoveryFeed(page, 20, search);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ── Header + Search ────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface">Discover</h1>
        <p className="text-on-surface-variant mt-1">Find talented professionals in the community</p>

        <div className="mt-4 relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-outline-variant bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── Grid ───────────────────────── */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-surface-container animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-on-surface-variant py-16">
          Failed to load profiles. Is the API running?
        </p>
      )}

      {data && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.data.map((profile: any, i: number) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                index={i}
                onClick={() => navigate(`/u/${profile.username}`)}
              />
            ))}
          </div>

          {data.data.length === 0 && (
            <p className="text-center text-on-surface-variant py-16">
              No profiles found. Try a different search.
            </p>
          )}

          {/* ── Pagination ──────────────── */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-full border border-outline-variant text-sm disabled:opacity-40 hover:bg-surface-container transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-on-surface-variant">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-4 py-2 rounded-full border border-outline-variant text-sm disabled:opacity-40 hover:bg-surface-container transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
