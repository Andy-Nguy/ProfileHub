import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../services/profile.service';
import { FloatingField } from '../components/shared/FloatingField';
import { Button } from '../components/shared/Button';

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.username || '',
    headline: '',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`,
    visibility: 'public' as 'public' | 'private',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await profileAPI.updateOnboarding(formData);
      // Success - redirect to dashboard or profile
      navigate('/discovery');
      // Refresh the page or state to update needsOnboarding? 
      // Ideally AuthContext should handle this, or we just window.location.href
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <motion.div 
        className="max-w-2xl w-full bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-xl p-8 md:p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <span className="material-symbols-outlined text-primary text-6xl mb-4">
            rocket_launch
          </span>
          <h1 className="font-display-md text-display-md text-on-surface font-bold mb-2">
            Welcome to ProHub!
          </h1>
          <p className="text-on-surface-variant text-body-lg">
            Let's set up your professional identity in just a few seconds.
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
                className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 object-cover"
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`})}
                className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:bg-surface-tint transition-colors"
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
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              required
            />

            <FloatingField 
              id="headline" 
              label="Professional Headline (e.g. Fullstack Developer)" 
              value={formData.headline}
              onChange={(e) => setFormData({...formData, headline: e.target.value})}
              required
            />

            <div className="space-y-3">
              <label className="text-sm font-medium text-on-surface-variant ml-1">Profile Visibility</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, visibility: 'public'})}
                  className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    formData.visibility === 'public' 
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
                  onClick={() => setFormData({...formData, visibility: 'private'})}
                  className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    formData.visibility === 'private' 
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
          </div>

          <Button 
            type="submit" 
            className="w-full justify-center bg-primary text-on-primary py-5 rounded-2xl text-lg font-bold shadow-xl hover:bg-surface-tint transition-all duration-200 gap-3"
            isLoading={isLoading}
            loadingText="Setting up your profile..."
          >
            Complete Setup
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
