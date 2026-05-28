import React from 'react';
import { useTranslation } from 'react-i18next';
import { SkillTag, SKILL_CATEGORY_CONFIG } from '../shared/SkillTag';
import { ISkill, SkillCategory } from '@profilehub/types';

interface SkillsSectionProps {
  skills: ISkill[];
  isOwner?: boolean;
  onEdit?: () => void;
}

const CATEGORY_ORDER: SkillCategory[] = [
  SkillCategory.TECHNICAL,
  SkillCategory.TOOL,
  SkillCategory.DOMAIN,
  SkillCategory.CERTIFICATION,
  SkillCategory.LANGUAGE,
  SkillCategory.SOFT_SKILL,
  SkillCategory.OTHER,
];

const CATEGORY_TRANSLATION_KEY: Record<SkillCategory, string> = {
  [SkillCategory.TECHNICAL]: 'skills.categories.technical',
  [SkillCategory.TOOL]: 'skills.categories.tools',
  [SkillCategory.DOMAIN]: 'skills.categories.domain',
  [SkillCategory.CERTIFICATION]: 'skills.categories.certification',
  [SkillCategory.LANGUAGE]: 'skills.categories.language',
  [SkillCategory.SOFT_SKILL]: 'skills.categories.softSkill',
  [SkillCategory.OTHER]: 'skills.categories.other',
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, isOwner, onEdit }) => {
  const { t } = useTranslation('profile');

  if (!skills || skills.length === 0) {
    return (
      <section
        className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300"
        style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology</span>
            {t('skills.title')}
          </h3>
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="text-sm text-primary hover:text-primary/70 font-medium flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                edit
              </span>
              {t('skills.edit')}
            </button>
          )}
        </div>
        <p className="text-on-surface-variant text-sm text-center py-4">
          {isOwner ? t('skills.addFirst') : t('skills.noSkills')}
        </p>
      </section>
    );
  }

  // Group skills by category, only categories that have skills
  const grouped: Partial<Record<SkillCategory, ISkill[]>> = {};
  for (const skill of skills) {
    const cat = skill.category ?? SkillCategory.OTHER;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(skill);
  }

  const activeCategories = CATEGORY_ORDER.filter((cat) => (grouped[cat]?.length ?? 0) > 0);

  return (
    <section
      className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">psychology</span>
          {t('skills.title')}
          <span className="ml-1 text-xs font-normal text-on-surface-variant bg-surface-container rounded-full px-2 py-0.5">
            {skills.length}
          </span>
        </h3>
        {isOwner && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:text-primary/70 font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              edit
            </span>
            {t('skills.edit')}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {activeCategories.map((cat) => {
          const cfg = SKILL_CATEGORY_CONFIG[cat];
          const catSkills = grouped[cat]!;
          return (
            <div key={cat} className="flex flex-col gap-2.5">
              {/* Category Label — neutral, plain text */}
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-on-surface-variant"
                  style={{ fontSize: '13px' }}
                >
                  {cfg.icon}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  {t(CATEGORY_TRANSLATION_KEY[cat])}
                </span>
                <div className="flex-1 h-px bg-outline-variant/30 ml-1" />
              </div>

              {/* Skill Chips */}
              <div className="flex flex-wrap gap-2 pl-0.5">
                {catSkills.map((skill) => (
                  <SkillTag key={skill.id} name={skill.name} category={skill.category} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
