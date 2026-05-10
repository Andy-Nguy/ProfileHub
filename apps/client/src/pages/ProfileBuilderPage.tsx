import React from 'react';
import { motion } from 'framer-motion';
import { SideNav } from '../components/layout/SideNav';
import { AppFooter } from '../components/layout/AppFooter';
import { CompletionBanner } from '../components/profile/CompletionBanner';
import { PersonalInfoSection } from '../components/profile/PersonalInfoSection';
import { ExperienceSection } from '../components/profile/ExperienceSection';
import { SkillsSection } from '../components/profile/SkillsSection';
import { VisibilityCard } from '../components/profile/VisibilityCard';

/**
 * ProfileBuilderPage — replaces feed.html / createProfile.html
 * Dashboard view with SideNav for editing/building your profile.
 */
export const ProfileBuilderPage: React.FC = () => {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 bg-surface py-[32px] px-[16px] md:px-gutter overflow-y-auto">
          <div className="max-w-[1280px] mx-auto">

            {/* ── Page Header ──────────────────── */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">
                    Profile Builder
                  </h1>
                  <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Complete your profile to increase your visibility within the ProHub community.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="border border-outline-variant text-primary font-label-lg text-label-lg py-2 px-6 rounded-full hover:bg-surface-container-low transition-colors">
                    Preview
                  </button>
                  <button className="bg-primary text-on-primary font-label-lg text-label-lg py-2 px-6 rounded-full hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Completion Progress */}
              <CompletionBanner percent={75} />
            </motion.div>

            {/* ── Bento Grid ───────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <PersonalInfoSection />
                <ExperienceSection
                  onAdd={() => console.log('Add experience')}
                  onEdit={(id) => console.log('Edit', id)}
                />
              </motion.div>

              {/* Right Column */}
              <motion.div
                className="lg:col-span-1 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <SkillsSection />
                <VisibilityCard />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <AppFooter variant="compact" />
      </main>
    </div>
  );
};
