import React from 'react';
import { SkillTag, SKILL_CATEGORY_CONFIG } from '../shared/SkillTag';
import { ISkill, SkillCategory } from '@profilehub/types';

interface SkillsSectionProps {
  skills: ISkill[];
  isOwner?: boolean;
  onEdit?: () => void;
}

const CATEGORY_ORDER: SkillCategory[] = [
  SkillCategory.LANGUAGE,
  SkillCategory.FRAMEWORK,
  SkillCategory.DATABASE,
  SkillCategory.CLOUD,
  SkillCategory.TOOL,
  SkillCategory.DESIGN,
  SkillCategory.SOFT_SKILL,
  SkillCategory.OTHER,
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, isOwner, onEdit }) => {
  if (!skills || skills.length === 0) {
    return (
      <section
        className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300"
        style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Skills
          </h3>
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="text-sm text-primary hover:text-primary/70 font-medium flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
              Edit
            </button>
          )}
        </div>
        <p className="text-on-surface-variant text-sm text-center py-4">
          {isOwner ? 'Add your first skill to showcase your expertise.' : 'No skills listed yet.'}
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

  const activeCategories = CATEGORY_ORDER.filter(cat => (grouped[cat]?.length ?? 0) > 0);

  return (
    <section
      className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">psychology</span>
          Skills
          <span className="ml-1 text-xs font-normal text-on-surface-variant bg-surface-container rounded-full px-2 py-0.5">
            {skills.length}
          </span>
        </h3>
        {isOwner && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:text-primary/70 font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
            Edit
          </button>
        )}
      </div>

      <div className="space-y-5">
        {activeCategories.map((cat) => {
          const cfg = SKILL_CATEGORY_CONFIG[cat];
          const catSkills = grouped[cat]!;
          return (
            <div key={cat}>
              {/* Category Header */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-3 ${cfg.bg} ${cfg.border} border`}>
                <span className={`material-symbols-outlined ${cfg.color}`} style={{ fontSize: '15px' }}>
                  {cfg.icon}
                </span>
                <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>

              {/* Skill Tags in this category */}
              <div className="flex flex-wrap gap-2">
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
