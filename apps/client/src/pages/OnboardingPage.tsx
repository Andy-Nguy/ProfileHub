import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/auth-login.service';
import { profileAPI } from '../services/profile.service';
import { FloatingField } from '../components/shared/FloatingField';
import { Button } from '../components/shared/Button';

export const OnboardingPage: React.FC = () => {
  const { user, authenticate } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOptional, setShowOptional] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.username || '',
    headline: '',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`,
    location: '',
    industry: '',
    bio: '',
    visibility: 'public' as 'public' | 'private',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await profileAPI.updateOnboarding(formData);

      // Re-fetch the user profile to get updated needsOnboarding = false.
      // Note: authAPI.getMe() returns { user, needsOnboarding, profileCompletion }
      // — no accessToken. We read the current token from localStorage directly.
      const meRes = await authAPI.getMe();
      if (meRes?.user) {
        const storedSession = JSON.parse(
          window.localStorage.getItem('profilehub.auth') || '{}',
        );
        if (storedSession.accessToken) {
          await authenticate(storedSession.accessToken, meRes.user);
        }
      }

      navigate('/discovery');
      // Refresh the page to update auth context needsOnboarding
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 py-12">
      <motion.div
        className="max-w-2xl w-full bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-xl p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <span className="material-symbols-outlined text-primary text-6xl mb-4">
            waving_hand
          </span>
          <h1 className="font-display-md text-display-md text-on-surface font-bold mb-2">
            Welcome to ProfileHub!
          </h1>
          <p className="text-on-surface-variant text-body-lg">
            Let's set up your professional identity. Fill in the basics to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={formData.avatarUrl}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 object-cover bg-surface-container"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}` })}
                className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mt-3">Click to randomize your avatar</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FloatingField
              id="displayName"
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required
            />

            <FloatingField
              id="headline"
              label="Professional Headline (e.g. Fullstack Developer)"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant ml-1">Profile Visibility *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: 'public' })}
                  className={`py-4 px-6 rounded-2xl border-2 transition-all flex items-center gap-3 ${formData.visibility === 'public'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-outline'
                    }`}
                >
                  <span className="material-symbols-outlined">public</span>
                  <div className="text-left">
                    <div className="font-bold">Public</div>
                    <div className="text-xs opacity-70">Visible to everyone</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: 'private' })}
                  className={`py-4 px-6 rounded-2xl border-2 transition-all flex items-center gap-3 ${formData.visibility === 'private'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-outline'
                    }`}
                >
                  <span className="material-symbols-outlined">lock</span>
                  <div className="text-left">
                    <div className="font-bold">Private</div>
                    <div className="text-xs opacity-70">Only you can see</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Toggle Optional Fields */}
            <div className="pt-4 border-t border-outline-variant/50">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="flex items-center text-primary font-medium hover:underline focus:outline-none"
              >
                {showOptional ? 'Hide' : 'Add'} optional details (Location, Industry, Bio)
                <span className="material-symbols-outlined ml-1 text-xl">
                  {showOptional ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>

            <AnimatePresence>
              {showOptional && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <FloatingField
                      id="location"
                      label="Location (Optional)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <FloatingField
                      id="industry"
                      label="Industry (Optional)"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-on-surface-variant ml-1 mb-2 block">Bio (Optional)</label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                      placeholder="Tell us a little bit about yourself..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            type="submit"
            className="w-full justify-center bg-primary text-on-primary py-5 rounded-2xl text-lg font-bold shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 gap-3 mt-8"
            isLoading={isLoading}
            loadingText="Saving..."
          >
            Complete Onboarding
            <span className="material-symbols-outlined">arrow_forward</span>
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

