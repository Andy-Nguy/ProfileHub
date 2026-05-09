import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SideNav } from '../components/layout/SideNav';
import { AppFooter } from '../components/layout/AppFooter';
import { ProfileEditDialog } from '../components/profile/ProfileEditDialog';
import {
  M3Card,
  SkillChip,
  EndorsementButton,
  ProfileHeader,
  TimelineSection,
} from '../../../../libs/shared/ui/src';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_PROFILES: Record<string, any> = {
  jdoe: {
    username: 'jdoe',
    displayName: 'John Doe',
    headline: 'Senior Software Engineer | Cloud Architect',
    bio: 'Passionate about building scalable cloud solutions and mentoring junior developers. 10+ years of experience in full-stack development with a focus on React and Node.js.',
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
    coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop',
    location: 'San Francisco, CA',
    likesCount: 156,
    completionPercent: 75,
    skills: [
      { id: '1', name: 'React', count: 45 },
      { id: '2', name: 'TypeScript', count: 32 },
      { id: '3', name: 'Node.js', count: 28 },
      { id: '4', name: 'AWS', count: 56 },
      { id: '5', name: 'Docker', count: 12 },
    ],
    experiences: [
      {
        id: 'exp1',
        title: 'Senior Software Engineer',
        subtitle: 'TechCorp Solutions',
        dateRange: '2020 - Present',
        description: 'Leading the core platform team, migrating monolithic services to microservices using AWS and Kubernetes.',
        onEdit: () => console.log('Edit exp1'),
      },
      {
        id: 'exp2',
        title: 'Full Stack Developer',
        subtitle: 'Startup Inc',
        dateRange: '2016 - 2020',
        description: 'Developed and maintained customer-facing web applications using the MERN stack.',
        onEdit: () => console.log('Edit exp2'),
      },
    ],
    educations: [
      {
        id: 'edu1',
        title: 'B.S. in Computer Science',
        subtitle: 'University of California, Berkeley',
        dateRange: '2012 - 2016',
      },
    ],
  },
  asmith: {
    username: 'asmith',
    displayName: 'Alice Smith',
    headline: 'UI/UX Designer | Branding Expert',
    bio: 'Creating user-centered designs that drive engagement. Specializing in minimalist aesthetics and complex design systems for enterprise products.',
    avatarUrl: 'https://i.pravatar.cc/150?u=2',
    coverUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2000&auto=format&fit=crop',
    location: 'New York, NY',
    likesCount: 89,
    completionPercent: 60,
    skills: [
      { id: 's1', name: 'Figma', count: 92 },
      { id: 's2', name: 'Branding', count: 41 },
      { id: 's3', name: 'Interaction Design', count: 67 },
    ],
    experiences: [
      {
        id: 'e1',
        title: 'Lead Designer',
        subtitle: 'Creative Agency',
        dateRange: '2019 - Present',
        description: 'Directing design strategy for Fortune 500 clients, overseeing a team of 10 designers.',
        onEdit: () => console.log('Edit e1'),
      },
    ],
    educations: [
      {
        id: 'ed1',
        title: 'M.A. in Visual Design',
        subtitle: 'Rhode Island School of Design',
        dateRange: '2017 - 2019',
      },
    ],
  },
};

// ─── The "current user" — in a real app this comes from auth context ──────────
const CURRENT_USER = 'jdoe';

/**
 * ProfilePage — unified single-page profile view.
 *
 * • Viewing own profile → shows "Edit Profile" button → opens ProfileEditDialog
 * • Viewing someone else's profile → shows Endorse / Connect actions only
 * • Route: /u/:username  (no username = own profile)
 */
export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const resolvedUsername = username || CURRENT_USER;
  const profile = MOCK_PROFILES[resolvedUsername] || MOCK_PROFILES[CURRENT_USER];
  const isOwnProfile = resolvedUsername === CURRENT_USER;

  const [dialogOpen, setDialogOpen] = useState(false);
  const isNewProfile = !profile.bio && profile.skills.length === 0;

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* Side Navigation */}
      <SideNav />

      {/* ── Edit / Create Dialog ─────────────────────────────────── */}
      <ProfileEditDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isCreating={isNewProfile}
        initialData={{
          firstName: profile.displayName.split(' ')[0],
          lastName: profile.displayName.split(' ')[1],
          headline: profile.headline,
          bio: profile.bio,
          skills: profile.skills.map((s: any) => s.name),
          completionPercent: profile.completionPercent,
        }}
        onSave={() => console.log('Profile saved')}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col">
        <div className="flex-1 bg-surface py-[32px] px-[16px] md:px-gutter overflow-y-auto">
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
              />

              {/* ── Action Row ─────────────────────────────────── */}
              <div className="flex items-center justify-end gap-3 mt-4">
                {isOwnProfile ? (
                  <>
                    {/* Own profile: Edit or Create */}
                    <button
                      onClick={() => setDialogOpen(true)}
                      className="flex items-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-surface-tint transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {isNewProfile ? 'add_circle' : 'edit'}
                      </span>
                      {isNewProfile ? 'Create Profile' : 'Edit Profile'}
                    </button>

                    <button className="flex items-center gap-2 border border-outline-variant text-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
                      Share
                    </button>
                  </>
                ) : (
                  <>
                    {/* Viewing someone else's profile */}
                    <button className="flex items-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-surface-tint transition-all shadow-sm">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                      Connect
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
                        <h3 className="font-title-lg text-title-lg text-on-surface">About</h3>
                        {isOwnProfile && (
                          <button
                            onClick={() => setDialogOpen(true)}
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
                    title="Experience"
                    icon="work"
                    items={profile.experiences}
                    onAdd={isOwnProfile ? () => setDialogOpen(true) : undefined}
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <TimelineSection
                    title="Education"
                    icon="school"
                    items={profile.educations}
                    onAdd={isOwnProfile ? () => setDialogOpen(true) : undefined}
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
                        Skills
                      </h3>
                      {isOwnProfile && (
                        <button
                          onClick={() => setDialogOpen(true)}
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
                      Endorsements
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-body-lg text-body-lg text-on-surface-variant">Total</span>
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
                    Social Presence
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-primary-fixed-variant mb-4">
                    {isOwnProfile
                      ? 'Share your portfolio across platforms.'
                      : `Connect with ${profile.displayName} on other platforms.`}
                  </p>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-on-primary-fixed text-primary-fixed flex items-center justify-center hover:opacity-80 transition-opacity">
                      <span className="material-symbols-outlined">link</span>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-on-primary-fixed text-primary-fixed flex items-center justify-center hover:opacity-80 transition-opacity">
                      <span className="material-symbols-outlined">alternate_email</span>
                    </button>
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
                      Profile completion: <span className="text-primary font-bold">{profile.completionPercent}%</span>
                    </p>
                    <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${profile.completionPercent}%` }}
                      />
                    </div>
                    <button
                      onClick={() => setDialogOpen(true)}
                      className="mt-4 w-full text-center font-label-lg text-label-lg text-primary hover:underline"
                    >
                      Complete your profile →
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AppFooter variant="compact" />
      </main>
    </div>
  );
};
