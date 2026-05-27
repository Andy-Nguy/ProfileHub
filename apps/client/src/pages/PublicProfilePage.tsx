import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { profileAPI, ProfileResponse } from '../services/profile.service';
import { EndorsementButton } from '@profilehub/ui';
import { ProfileHeader } from '@profilehub/ui';
import { TimelineSection } from '@profilehub/ui';
import { ISkill, IExperience, IEducation, ISocialLink } from '@profilehub/types';
import { SkillsSection } from '../components/profile/SkillsSection';
import { DashboardLoader } from '../components/shared/LottieLoader';
import { useMinimumLoading } from '../hooks/useMinimumLoading';

const formatYearRange = (
  startDate: string | Date,
  endDate: string | Date | null,
  isCurrent: boolean,
): string => {
  const startYear = new Date(startDate).getFullYear();
  const endYear = isCurrent ? 'Present' : endDate ? new Date(endDate).getFullYear() : '';
  return `${startYear} – ${endYear}`;
};

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation('profile');
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (username) {
          const data = await profileAPI.getPublicProfile(username);
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch public profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const showLoading = useMinimumLoading(loading);

  if (showLoading) {
    return <DashboardLoader label={t('page.loading')} />;
  }

  if (!profile) {
    return (
      <div className="flex-1 md:ml-72 min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface p-6">
        <div
          className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-10 text-center max-w-md"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <span
            className="material-symbols-outlined text-on-surface-variant/30 mb-3"
            style={{ fontSize: '56px' }}
          >
            person_off
          </span>
          <h1 className="text-xl font-bold text-on-surface mb-2">{t('page.notFound')}</h1>
          <p className="text-on-surface-variant text-sm mb-6">
            {t('page.notFoundMessage', { username })}
          </p>
          <Link
            to="/discovery"
            className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_back
            </span>
            {t('page.backToDiscovery')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 md:ml-72 flex flex-col min-h-[calc(100vh-64px)] bg-surface">
      <div className="flex-1 py-6 px-4 md:px-8">
        <div className="w-full max-w-[1024px] mx-auto space-y-5 pb-12">
          {/* ── Profile Header ───────────────────────────── */}
          <ProfileHeader
            displayName={profile.displayName}
            headline={profile.headline}
            location={profile.location}
            industry={profile.industry}
            username={profile.username}
            socialLinks={profile.socialLinks}
            avatarUrl={profile.avatarUrl}
            coverUrl={profile.coverUrl}
            showActions={true}
            isOwnProfile={false}
          />

          {/* ── Main Grid ────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* ── Left Column: About + Skills ──────────── */}
            <div className="md:col-span-1 space-y-5">
              {/* About */}
              {profile.bio && (
                <section
                  className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-5"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                >
                  <h3 className="font-semibold text-on-surface text-base flex items-center gap-2 mb-3">
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontSize: '20px' }}
                    >
                      person
                    </span>
                    {t('page.about')}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{profile.bio}</p>
                </section>
              )}

              {/* Skills */}
              <SkillsSection skills={profile.skills} isOwner={false} />

              {/* Endorsements */}
              <section
                className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-5"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <h3 className="font-semibold text-on-surface text-base flex items-center gap-2 mb-3">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: '20px' }}
                  >
                    verified
                  </span>
                  {t('page.endorsements')}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">{t('page.total')}</span>
                  <EndorsementButton count={profile.likesCount} isEndorsed={false} />
                </div>
              </section>
            </div>

            {/* ── Right Column: Experience + Education ─── */}
            <div className="md:col-span-2 space-y-5">
              {/* Experience */}
              <TimelineSection
                title={t('page.experience')}
                icon="work"
                items={(profile.experiences ?? []).map((exp: IExperience) => ({
                  id: exp.id,
                  title: exp.title,
                  subtitle: exp.company,
                  dateRange: formatYearRange(exp.startDate, exp.endDate, exp.isCurrent),
                  description: exp.description ?? undefined,
                  badge: exp.employmentType,
                  location: exp.location ?? undefined,
                  logoUrl: exp.companyDetails?.logoUrl ?? undefined,
                }))}
              />

              {/* Education */}
              <TimelineSection
                title={t('page.education')}
                icon="school"
                items={(profile.educations ?? []).map((edu: IEducation) => ({
                  id: edu.id,
                  title: edu.institution,
                  subtitle: [edu.degree, edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : '']
                    .filter(Boolean)
                    .join(' '),
                  dateRange: formatYearRange(edu.startDate, edu.endDate, edu.isCurrent),
                  description: edu.description ?? undefined,
                  logoUrl: edu.institutionLogoUrl ?? undefined,
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-variant bg-surface-container-low">
        <div className="max-w-[1024px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-primary text-lg">ProHub</span>
          <div className="flex items-center gap-6 text-xs text-on-surface-variant">
            <a href="#" className="hover:text-on-surface transition-colors">
              {t('footer.privacyPolicy')}
            </a>
            <a href="#" className="hover:text-on-surface transition-colors">
              {t('footer.termsOfService')}
            </a>
          </div>
          <p className="text-xs text-on-surface-variant/60">{t('footer.copyright')}</p>
        </div>
      </footer>
    </main>
  );
};
