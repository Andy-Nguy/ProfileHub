import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompletionBanner } from './CompletionBanner';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { VisibilityCard } from './VisibilityCard';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** When true, shows "Create Profile" wording instead of "Edit" */
  isCreating?: boolean;
  initialData?: {
    firstName?: string;
    lastName?: string;
    headline?: string;
    bio?: string;
    skills?: string[];
    completionPercent?: number;
  };
  onSave?: () => void;
}

export const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  isOpen,
  onClose,
  isCreating = false,
  initialData = {},
  onSave,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSave = () => {
    onSave?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog panel — slides up from bottom on mobile, centers on desktop */}
          <motion.div
            className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto w-full md:max-w-4xl md:mx-4 bg-surface rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col"
              style={{ maxHeight: '92vh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* ── Dialog Header ──────────────────── */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-outline-variant flex-shrink-0">
                {/* Drag handle (mobile) */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-outline-variant md:hidden" />

                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                    {isCreating ? 'Create Your Profile' : 'Edit Profile'}
                  </h2>
                  <p className="font-label-lg text-label-lg text-on-surface-variant mt-0.5">
                    {isCreating
                      ? 'Fill in your professional details to get started.'
                      : 'Update your information to stay relevant.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={onClose}
                    className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-colors"
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              {/* ── Scrollable Body ─────────────────── */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Completion Progress */}
                <CompletionBanner
                  percent={initialData.completionPercent ?? 75}
                  message="Complete all sections to maximize your profile visibility."
                />

                {/* Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <PersonalInfoSection
                      firstName={initialData.firstName}
                      lastName={initialData.lastName}
                      headline={initialData.headline}
                      bio={initialData.bio}
                    />
                    <ExperienceSection
                      onAdd={() => console.log('Add experience')}
                      onEdit={(id) => console.log('Edit', id)}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-1 space-y-6">
                    <SkillsSection initialSkills={initialData.skills} />
                    <VisibilityCard />
                  </div>
                </div>
              </div>

              {/* ── Dialog Footer / Actions ─────────── */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant flex-shrink-0 bg-surface rounded-b-2xl">
                <button
                  onClick={onClose}
                  className="border border-outline-variant text-primary font-label-lg text-label-lg py-2.5 px-6 rounded-full hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-primary text-on-primary font-label-lg text-label-lg py-2.5 px-6 rounded-full hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                  {isCreating ? 'Create Profile' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
