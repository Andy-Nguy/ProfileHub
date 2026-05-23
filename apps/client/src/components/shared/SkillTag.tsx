import React from 'react';
import { SkillCategory } from '@profilehub/types';

export const SKILL_CATEGORY_CONFIG: Record<
  SkillCategory,
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  [SkillCategory.LANGUAGE]: {
    label: 'Languages',
    icon: 'code',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  [SkillCategory.FRAMEWORK]: {
    label: 'Frameworks',
    icon: 'layers',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  [SkillCategory.TOOL]: {
    label: 'Tools',
    icon: 'build',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  [SkillCategory.DATABASE]: {
    label: 'Databases',
    icon: 'database',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  [SkillCategory.CLOUD]: {
    label: 'Cloud & DevOps',
    icon: 'cloud',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
  },
  [SkillCategory.DESIGN]: {
    label: 'Design',
    icon: 'palette',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  [SkillCategory.SOFT_SKILL]: {
    label: 'Soft Skills',
    icon: 'psychology',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  [SkillCategory.OTHER]: {
    label: 'Other',
    icon: 'more_horiz',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
  },
};

interface SkillTagProps {
  name: string;
  category?: SkillCategory;
  onRemove?: () => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({ name, category, onRemove }) => {
  const config = category ? SKILL_CATEGORY_CONFIG[category] : null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 border transition-all duration-200 group
        ${config ? `${config.bg} ${config.border} hover:opacity-80` : 'bg-surface-container border-outline-variant hover:bg-surface-variant'}
      `}
    >
      {config && (
        <span
          className={`material-symbols-outlined ${config.color}`}
          style={{ fontSize: '13px' }}
        >
          {config.icon}
        </span>
      )}
      <span
        className={`text-sm font-medium ${config ? config.color : 'text-on-surface'}`}
      >
        {name}
      </span>
      {onRemove && (
        <button
          onClick={onRemove}
          className={`ml-0.5 rounded-full p-0.5 transition-colors opacity-0 group-hover:opacity-100
            ${config ? `${config.color} hover:bg-white/60` : 'text-on-surface-variant hover:text-error'}
          `}
          aria-label={`Remove ${name}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
        </button>
      )}
    </div>
  );
};
