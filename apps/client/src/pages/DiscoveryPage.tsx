import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SideNav } from '../components/layout/SideNav';
import { AppFooter } from '../components/layout/AppFooter';
import { useDiscoveryFeed } from '../hooks/useApi';
import { ProfileResponse } from '../services/profile.service';
import { ISkill } from '@profilehub/types';
import { DashboardLoader, LottieLoader } from '../components/shared/LottieLoader';
import { useMinimumLoading } from '../hooks/useMinimumLoading';
import { useDebounce } from '../hooks/useDebounce';


const MOCK_PROFILES = [
  {
    id: '1',
    username: 'jdoe',
    displayName: 'John Doe',
    headline: 'Senior Software Engineer | Cloud Architect',
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
    skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'AWS' }],
    likesCount: 156,
  },
  {
    id: '2',
    username: 'asmith',
    displayName: 'Alice Smith',
    headline: 'UI/UX Designer | Branding Expert',
    avatarUrl: 'https://i.pravatar.cc/150?u=2',
    skills: [{ name: 'Figma' }, { name: 'Adobe XD' }, { name: 'Branding' }],
    likesCount: 89,
  },
  {
    id: '3',
    username: 'bwilliams',
    displayName: 'Bob Williams',
    headline: 'Data Scientist | Machine Learning Enthusiast',
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
    skills: [{ name: 'Python' }, { name: 'PyTorch' }, { name: 'Pandas' }],
    likesCount: 210,
  },
  {
    id: '4',
    username: 'ejohnson',
    displayName: 'Emily Johnson',
    headline: 'Product Manager | Agile Coach',
    avatarUrl: 'https://i.pravatar.cc/150?u=4',
    skills: [{ name: 'Jira' }, { name: 'Scrum' }, { name: 'Roadmapping' }],
    likesCount: 45,
  },
  {
    id: '5',
    username: 'mgarcia',
    displayName: 'Michael Garcia',
    headline: 'Full Stack Developer | Open Source Contributor',
    avatarUrl: 'https://i.pravatar.cc/150?u=5',
    skills: [{ name: 'TypeScript' }, { name: 'GraphQL' }, { name: 'Docker' }],
    likesCount: 128,
  },
  {
    id: '6',
    username: 'smartinez',
    displayName: 'Sophia Martinez',
    headline: 'DevOps Engineer | SRE',
    avatarUrl: 'https://i.pravatar.cc/150?u=6',
    skills: [{ name: 'Kubernetes' }, { name: 'Terraform' }, { name: 'Go' }],
    likesCount: 72,
  },
];

export const DiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 150);
  const { t } = useTranslation('profile');

  const { data, isFetching, error } = useDiscoveryFeed(1, 100, debouncedSearch);
  const showLoading = useMinimumLoading(isFetching);

  const profiles = data?.data || [];

  const filtered = profiles.filter(
    (p: ProfileResponse) =>
      p.displayName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.skills?.some((s: ISkill) => s.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );


  return (
    <>
      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 bg-surface py-[32px] px-[16px] md:px-gutter">
          <div className="max-w-[1280px] mx-auto">

            {/* ── Header + Search ─────────────── */}
            <motion.div
              className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-background">
                  {t('discovery.title')}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                  {t('discovery.subtitle')}
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  placeholder={t('discovery.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-outline-variant bg-surface-container-lowest text-body-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}
                />
              </div>
            </motion.div>

            {/* ── Profile Grid ────────────────── */}
            {showLoading ? (
              <div className="flex items-center justify-center py-24 min-h-[300px]">
                <LottieLoader label={t('discovery.loading')} />
              </div>
            ) : error ? (
              <div className="text-center py-24 text-error">
                <div className="text-xl">{t('discovery.errorLoading')}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((profile: ProfileResponse, i: number) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/u/${profile.username}`)}
                    className="cursor-pointer bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:border-primary hover:shadow-md transition-all duration-300 flex flex-col gap-4"
                    style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">
                      <img
                        src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=6366f1&color=fff&size=150`}
                        alt={profile.displayName}
                        className="w-16 h-16 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <h3 className="font-title-lg text-title-lg text-on-background font-bold">
                          {profile.displayName}
                        </h3>
                        <p className="font-label-lg text-label-lg text-on-surface-variant">
                          @{profile.username}
                        </p>
                      </div>
                    </div>

                    {/* Headline */}
                    <p className="font-body-lg text-body-lg text-on-surface-variant line-clamp-2">
                      {profile.headline}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {profile.skills?.map((skill: ISkill) => (
                        <span
                          key={skill.name}
                          className="inline-flex items-center bg-surface-container border border-outline-variant rounded-lg px-3 py-1 font-label-lg text-label-lg text-on-surface"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>

                    {/* Endorsements */}
                    <div className="flex items-center gap-1.5 text-primary pt-2 border-t border-outline-variant/30">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
                      >
                        favorite
                      </span>
                      <span className="font-label-lg text-label-lg">
                        {profile.likesCount} {t('discovery.endorsements')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!showLoading && !error && filtered.length === 0 && (
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-6xl text-outline-variant block mb-4">
                  search_off
                </span>
                <p className="text-on-surface-variant font-headline-lg text-headline-lg">
                  {t('discovery.noResults')}
                </p>
              </div>
            )}
          </div>
        </div>

        <AppFooter variant="compact" />
      </main>
    </>
  );
};
