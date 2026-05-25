import React from 'react';
import { SkillCategory } from '@profilehub/types';

// Category config — chỉ dùng label & icon cho section header trong SkillsSection.
// Chip tags dùng style neutral thống nhất, không màu mè.
export const SKILL_CATEGORY_CONFIG: Record<SkillCategory, { label: string; icon: string }> = {
  [SkillCategory.TECHNICAL]: { label: 'Technical', icon: 'engineering' },
  [SkillCategory.TOOL]: { label: 'Tools & Software', icon: 'build' },
  [SkillCategory.DOMAIN]: { label: 'Domain Knowledge', icon: 'menu_book' },
  [SkillCategory.LANGUAGE]: { label: 'Languages', icon: 'translate' },
  [SkillCategory.CERTIFICATION]: { label: 'Certifications', icon: 'workspace_premium' },
  [SkillCategory.SOFT_SKILL]: { label: 'Soft Skills', icon: 'psychology' },
  [SkillCategory.OTHER]: { label: 'Other', icon: 'more_horiz' },
};

interface SkillTagProps {
  name: string;
  category?: SkillCategory; // giữ prop để không break SkillsDialog, nhưng không dùng để tô màu
  onRemove?: () => void;
}

/**
 * SkillTag — neutral chip, không màu theo category.
 * Inspired by Read.cv / Linear minimal style.
 */
export const SkillTag: React.FC<SkillTagProps> = ({ name, onRemove }) => (
  <div className="inline-flex items-center gap-1 rounded-md border border-outline-variant bg-surface-container px-3 py-1 transition-colors duration-150 hover:bg-surface-variant group">
    <span className="text-sm font-medium text-on-surface">{name}</span>
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-0.5 rounded p-0.5 text-on-surface-variant opacity-0 transition-all group-hover:opacity-100 hover:text-error"
        aria-label={`Remove ${name}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
          close
        </span>
      </button>
    )}
  </div>
);
