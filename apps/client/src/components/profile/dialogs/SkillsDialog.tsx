import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseDialog } from './BaseDialog';
import { SkillTag, SKILL_CATEGORY_CONFIG } from '../../shared/SkillTag';
import { ProfileResponse, profileAPI } from '../../../services/profile.service';
import { getErrorMessage } from '../../../services/api.service';
import { toast } from 'sonner';
import { ISkill, SkillCategory } from '@profilehub/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileResponse;
  onSuccess: () => void;
}

const ALL_CATEGORIES = Object.values(SkillCategory);

export const SkillsDialog: React.FC<Props> = ({ isOpen, onClose, profile, onSuccess }) => {
  const { t } = useTranslation('profile');
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>(SkillCategory.OTHER);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SkillCategory | 'all'>('all');

  useEffect(() => {
    if (isOpen && profile?.skills) {
      setSkills(profile.skills);
    }
  }, [isOpen, profile]);

  const addSkill = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await profileAPI.addSkill({ name: trimmed, category: selectedCategory });
      setInputValue('');
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = async (id: string) => {
    setLoading(true);
    try {
      await profileAPI.deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = activeFilter === 'all'
    ? skills
    : skills.filter(s => s.category === activeFilter);

  // Count per category for filter badges
  const countByCategory = ALL_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat).length;
    return acc;
  }, {});

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title={t('dialogs.skills.title')}>
      <div className="space-y-5">

        {/* ── Add Skill Row ── */}
        <div className="space-y-3">
          {/* Name Input */}
          <div className="relative">
            <input
              id="addSkillInput"
              type="text"
              placeholder=" "
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="block px-4 pb-2.5 pt-5 w-full text-body-lg text-on-surface bg-transparent rounded-lg border border-outline appearance-none focus:outline-none focus:ring-1 focus:border-primary peer pr-12"
            />
            <label
              htmlFor="addSkillInput"
              className="absolute text-label-lg text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-surface px-2
                peer-focus:px-2 peer-focus:text-primary
                peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
                peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
            >
              {t('dialogs.skills.inputLabel')}
            </label>
            <button
              onClick={addSkill}
              disabled={loading || !inputValue.trim()}
              className="absolute right-3 top-4 text-primary hover:text-primary/70 transition-colors disabled:opacity-40"
              aria-label={t('dialogs.skills.addAriaLabel')}
            >
              <span className="material-symbols-outlined">add_circle</span>
            </button>
          </div>

          {/* Category Selector */}
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wide">{t('dialogs.skills.categoryLabel')}</p>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => {
                const cfg = SKILL_CATEGORY_CONFIG[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                      ${isSelected
                        ? 'bg-surface-variant border-outline text-on-surface ring-2 ring-primary ring-offset-1'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface'
                      }
                    `}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{cfg.icon}</span>
                    {t(cfg.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        {skills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wide">{t('dialogs.skills.filterLabel')}</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                  ${activeFilter === 'all'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-outline'
                  }
                `}
              >
                {t('dialogs.skills.filterAll', { count: skills.length })}
              </button>
              {ALL_CATEGORIES.filter(cat => countByCategory[cat] > 0).map(cat => {
                const cfg = SKILL_CATEGORY_CONFIG[cat];
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all
                      ${isActive
                        ? 'bg-surface-variant border-outline text-on-surface'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface'
                      }
                    `}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{cfg.icon}</span>
                    {t(cfg.labelKey)} ({countByCategory[cat]})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Skills List ── */}
        <div className="min-h-[100px] border border-outline-variant rounded-xl p-4">
          {filteredSkills.length === 0 ? (
            <p className="text-on-surface-variant text-sm text-center py-6">
              {skills.length === 0 ? t('dialogs.skills.emptyAll') : t('dialogs.skills.emptyCategory')}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map((skill) => (
                <SkillTag
                  key={skill.id}
                  name={skill.name}
                  category={skill.category}
                  onRemove={() => removeSkill(skill.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </BaseDialog>
  );
};
