import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SideNav } from '../components/layout/SideNav';
import { AppFooter } from '../components/layout/AppFooter';
import { BasicInfoDialog } from '../components/profile/dialogs/BasicInfoDialog';
import { AboutDialog } from '../components/profile/dialogs/AboutDialog';
import { SkillsDialog } from '../components/profile/dialogs/SkillsDialog';
import { ExperienceDialog } from '../components/profile/dialogs/ExperienceDialog';
import { EducationDialog } from '../components/profile/dialogs/EducationDialog';
import { AvatarEditDialog } from '../components/profile/dialogs/AvatarEditDialog';
import { profileAPI } from '../services/profile.service';
import { useAuth } from '../contexts/AuthContext';
import {
  M3Card,
  SkillChip,
  EndorsementButton,
  ProfileHeader,
  TimelineSection,
} from '@profilehub/ui';



/**
 * ProfilePage — unified single-page profile view.
 *
 * • Viewing own profile → shows "Edit Profile" button → opens ProfileEditDialog
 * • Viewing someone else's profile → shows Endorse / Connect actions only
 * • Route: /u/:username  (no username = own profile)
 */
export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { t } = useTranslation('profile');
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Legacy, can remove
  const [basicInfoOpen, setBasicInfoOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [expState, setExpState] = useState<{ isOpen: boolean; id?: string; data?: any }>({ isOpen: false });
  const [eduState, setEduState] = useState<{ isOpen: boolean; id?: string; data?: any }>({ isOpen: false });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (username) {
        const data = await profileAPI.getPublicProfile(username);
        setProfile(data);
      } else {
        const data = await profileAPI.getMyProfile();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const isOwnProfile = !username || user?.username === username;

  const handleAvatarUpload = async (file: File) => {
    if (!isOwnProfile) return;
    setAvatarUploading(true);
    try {
      const res = await profileAPI.uploadAvatar(file);
      // Update local profile state directly so UI responds instantly
      setProfile((prev: any) => ({ ...prev, avatarUrl: res.avatarUrl }));
    } catch (error) {
      console.error('Avatar upload failed', error);
    } finally {
      setAvatarUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, user]);

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('page.loading')}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-background text-on-background min-h-screen flex">
        {/* Side Navigation */}
        <SideNav />

        {/* Main Content */}
        <main className="flex-1 md:ml-72 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6">
            <M3Card className="w-full max-w-2xl p-8 text-center">
              <h1 className="text-2xl font-bold mb-2">{t('page.notFound')}</h1>
              <p className="text-on-surface-variant">
                {t('page.notFoundMessage', { username: username || 'you' })}
              </p>
            </M3Card>
          </div>
          <AppFooter />
        </main>
      </div>
    );
  }

  const isNewProfile = !profile.bio && profile.skills.length === 0;

  return (
    <>

      {/* ── Dialogs ─────────────────────────────────── */}
      {isOwnProfile && profile && (
        <>
          <AvatarEditDialog 
            isOpen={avatarDialogOpen} 
            onClose={() => setAvatarDialogOpen(false)} 
            currentAvatarUrl={profile.avatarUrl} 
            onUpload={handleAvatarUpload}
            isUploading={avatarUploading}
          />
          <BasicInfoDialog isOpen={basicInfoOpen} onClose={() => setBasicInfoOpen(false)} profile={profile} onSuccess={fetchProfile} />
          <AboutDialog isOpen={aboutOpen} onClose={() => setAboutOpen(false)} profile={profile} onSuccess={fetchProfile} />
          <SkillsDialog isOpen={skillsOpen} onClose={() => setSkillsOpen(false)} profile={profile} onSuccess={fetchProfile} />
          <ExperienceDialog 
            isOpen={expState.isOpen} 
            onClose={() => setExpState({ isOpen: false })} 
            experienceId={expState.id} 
            initialData={expState.data} 
            onSuccess={fetchProfile} 
          />
          <EducationDialog 
            isOpen={eduState.isOpen} 
            onClose={() => setEduState({ isOpen: false })} 
            educationId={eduState.id} 
            initialData={eduState.data} 
            onSuccess={fetchProfile} 
          />
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 bg-surface py-[32px] px-[16px] md:px-gutter">
          <div className="max-w-[1280px] mx-auto space-y-6">

            {/* ── Profile Header ─────────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProfileHeader
                displayName={profile.displayName}
                headline={profile.headline}
                location={profile.location}
                avatarUrl={profile.avatarUrl}
                coverUrl={profile.coverUrl}
                showActions={!isOwnProfile}
                isOwnProfile={isOwnProfile}
                onAvatarClick={() => setAvatarDialogOpen(true)}
                avatarUploading={avatarUploading}
              />

              {/* ── Action Row ─────────────────────────────────── */}
              <div className="flex items-center justify-end gap-3 mt-4">
                {isOwnProfile ? (
                  <>
                    {/* Own profile: Edit or Create */}
                    <button
                      onClick={() => setBasicInfoOpen(true)}
                      className="flex items-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-surface-tint transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {isNewProfile ? 'bolt' : 'edit'}
                      </span>
                      {isNewProfile ? t('page.completeProfile') : t('page.editProfile')}
                    </button>

                    <button className="flex items-center gap-2 border border-outline-variant text-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
                      {t('page.share')}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Viewing someone else's profile */}
                    <button className="flex items-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-surface-tint transition-all shadow-sm">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                      {t('page.connect')}
                    </button>
                    <EndorsementButton count={profile.likesCount} isEndorsed={false} />
                  </>
                )}
              </div>
            </motion.section>

            {/* ── Main Grid ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left: About + Timeline */}
              <div className="lg:col-span-2 space-y-6">
                {profile.bio && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <M3Card>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-title-lg text-title-lg text-on-surface">{t('page.about')}</h3>
                        {isOwnProfile && (
                          <button
                            onClick={() => setAboutOpen(true)}
                            className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1.5 transition-colors"
                            aria-label="Edit about"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                          </button>
                        )}
                      </div>
                      <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                        {profile.bio}
                      </p>
                    </M3Card>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <TimelineSection
                    title={t('page.experience')}
                    icon="work"
                    items={profile.experiences?.map((exp: any) => ({
                      id: exp.id,
                      title: exp.title,
                      subtitle: exp.company,
                      dateRange: `${new Date(exp.startDate).getFullYear()} - ${exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}`,
                      description: exp.description,
                      onEdit: isOwnProfile ? () => setExpState({ isOpen: true, id: exp.id, data: exp }) : undefined,
                    })) || []}
                    onAdd={isOwnProfile ? () => setExpState({ isOpen: true }) : undefined}
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <TimelineSection
                    title={t('page.education')}
                    icon="school"
                    items={profile.educations?.map((edu: any) => ({
                      id: edu.id,
                      title: edu.institution,
                      subtitle: `${edu.degree || ''} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}`,
                      dateRange: `${new Date(edu.startDate).getFullYear()} - ${edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}`,
                      description: edu.description,
                      onEdit: isOwnProfile ? () => setEduState({ isOpen: true, id: edu.id, data: edu }) : undefined,
                    })) || []}
                    onAdd={isOwnProfile ? () => setEduState({ isOpen: true }) : undefined}
                  />
                </motion.div>
              </div>

              {/* Right: Skills + Social */}
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <M3Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">psychology</span>
                        {t('page.skills')}
                      </h3>
                      {isOwnProfile && (
                        <button
                          onClick={() => setSkillsOpen(true)}
                          className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1.5 transition-colors"
                          aria-label="Edit skills"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {profile.skills.map((skill: any) => (
                        <SkillChip key={skill.id} name={skill.name} />
                      ))}
                    </div>

                    <hr className="border-outline-variant mb-6" />

                    <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">verified</span>
                      {t('page.endorsements')}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-body-lg text-body-lg text-on-surface-variant">{t('page.total')}</span>
                      <EndorsementButton count={profile.likesCount} isEndorsed={isOwnProfile} />
                    </div>
                  </M3Card>
                </motion.div>

                {/* Social Presence */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-primary-fixed rounded-[16px] p-6"
                  style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.08)' }}
                >
                  <h3 className="font-title-lg text-title-lg text-on-primary-fixed mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">share</span>
                    {t('page.socialPresence')}
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-primary-fixed-variant mb-4">
                    {isOwnProfile
                      ? t('page.socialPresenceOwn')
                      : t('page.socialPresenceOther', { name: profile.displayName })}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {profile.socialLinks?.map((link: any) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-on-primary-fixed text-primary-fixed flex items-center justify-center hover:opacity-80 transition-opacity"
                        title={link.platform}
                      >
                        <span className="material-symbols-outlined">
                          {link.platform === 'github' ? 'code' : 
                           link.platform === 'linkedin' ? 'work' : 
                           link.platform === 'twitter' ? 'chat' : 'link'}
                        </span>
                      </a>
                    ))}
                    {(!profile.socialLinks || profile.socialLinks.length === 0) && (
                      <p className="text-on-primary-fixed-variant text-body-md">{t('page.noSocialLinks')}</p>
                    )}
                  </div>
                </motion.div>

                {/* Own profile: Quick visibility toggle reminder */}
                {isOwnProfile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-surface-container-low rounded-[16px] p-5 border border-outline-variant"
                  >
                    <p className="font-label-lg text-label-lg text-on-surface-variant mb-3">
                      {t('page.profileCompletion')} <span className="text-primary font-bold">{profile.completionPercent}%</span>
                    </p>
                    <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${profile.completionPercent}%` }}
                      />
                    </div>
                    <button
                      onClick={() => setBasicInfoOpen(true)}
                      className="mt-4 w-full text-center font-label-lg text-label-lg text-primary hover:underline"
                    >
                      {t('page.completeProfileCta')}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AppFooter variant="compact" />
      </main>
    </>
  );
};
