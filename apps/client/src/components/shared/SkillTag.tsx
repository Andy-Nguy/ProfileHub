import React from 'react';
import { SkillCategory } from '@profilehub/types';

export const SKILL_CATEGORY_CONFIG: Record<
  SkillCategory,
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  // Kỹ năng chuyên môn cốt lõi — React, Kế toán thuế, SEO, AutoCAD...
  [SkillCategory.TECHNICAL]: {
    label: 'Technical',
    icon: 'engineering',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  // Công cụ & Phần mềm — Docker, SAP, Google Analytics, Figma, Excel...
  [SkillCategory.TOOL]: {
    label: 'Tools & Software',
    icon: 'build',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  // Phương pháp & Quy trình — Agile, Six Sigma, Montessori, IFRS...
  [SkillCategory.METHODOLOGY]: {
    label: 'Methodology',
    icon: 'account_tree',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  // Kiến thức ngành & lý thuyết — Machine Learning, Luật thuế, Dược lý...
  [SkillCategory.DOMAIN]: {
    label: 'Domain Knowledge',
    icon: 'menu_book',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  // Ngôn ngữ giao tiếp — English, Japanese, Korean, French...
  [SkillCategory.LANGUAGE]: {
    label: 'Languages',
    icon: 'translate',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
  },
  // Chứng chỉ & Bằng cấp — AWS SAA, CPA, PMP, IELTS, TESOL...
  [SkillCategory.CERTIFICATION]: {
    label: 'Certifications',
    icon: 'workspace_premium',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  // Kỹ năng mềm — Leadership, Communication, Critical Thinking...
  [SkillCategory.SOFT_SKILL]: {
    label: 'Soft Skills',
    icon: 'psychology',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  // Các kỹ năng khác không thuộc nhóm trên
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
