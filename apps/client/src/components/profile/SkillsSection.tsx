import React, { useState } from 'react';
import { SkillTag } from '../shared/SkillTag';

const DEFAULT_SKILLS = ['UI Design', 'UX Research', 'Figma', 'Design Systems'];

interface SkillsSectionProps {
  initialSkills?: string[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  initialSkills = DEFAULT_SKILLS,
}) => {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (name: string) => {
    setSkills((prev) => prev.filter((s) => s !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}>
      <h3 className="font-title-lg text-title-lg text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">psychology</span>
        Skills
      </h3>

      {/* Add skill input */}
      <div className="relative mb-4">
        <input
          id="addSkill"
          type="text"
          placeholder=" "
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block px-4 pb-2.5 pt-5 w-full text-body-lg text-on-surface bg-transparent rounded-lg border border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer pr-12"
        />
        <label
          htmlFor="addSkill"
          className="absolute text-label-lg text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-surface-container-lowest px-2
            peer-focus:px-2 peer-focus:text-primary
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
        >
          Add a skill
        </label>
        <button
          onClick={addSkill}
          className="absolute right-3 top-4 text-primary hover:text-surface-tint transition-colors"
          aria-label="Add skill"
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillTag key={skill} name={skill} onRemove={() => removeSkill(skill)} />
        ))}
      </div>
    </section>
  );
};
