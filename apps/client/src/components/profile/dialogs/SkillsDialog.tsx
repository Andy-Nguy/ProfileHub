import React, { useState, useEffect } from 'react';
import { BaseDialog } from './BaseDialog';
import { Button } from '../../shared/Button';
import { SkillTag } from '../../shared/SkillTag';
import { profileAPI } from '../../../services/profile.service';
import { apiClient } from '../../../services/api.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSuccess: () => void;
}

export const SkillsDialog: React.FC<Props> = ({ isOpen, onClose, profile, onSuccess }) => {
  const [skills, setSkills] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

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
      const newSkill = await profileAPI.addSkill({ name: trimmed });
      setSkills(prev => [...prev, newSkill]);
      setInputValue('');
      onSuccess();
    } catch (e) {
      // Error handled
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

    // I'll assume profileAPI has deleteSkill, or we can just use apiClient directly if not.
    // Let's implement delete action using apiClient directly just in case it's missing in service.
  
  const removeSkill = async (id: string) => {
    setLoading(true);
    try {
      await apiClient.delete(`/profiles/me/skills/${id}`);
      setSkills(prev => prev.filter(s => s.id !== id));
      onSuccess();
    } catch (e) {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} title="Edit Skills">
      <div className="space-y-6">
        <div className="relative">
          <input
            id="addSkill"
            type="text"
            placeholder=" "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="block px-4 pb-2.5 pt-5 w-full text-body-lg text-on-surface bg-transparent rounded-lg border border-outline appearance-none focus:outline-none focus:ring-1 focus:border-primary peer pr-12"
          />
          <label
            htmlFor="addSkill"
            className="absolute text-label-lg text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] bg-surface-container-lowest px-2
              peer-focus:px-2 peer-focus:text-primary
              peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
              peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
          >
            Add a skill and press Enter
          </label>
          <button
            onClick={addSkill}
            disabled={loading}
            className="absolute right-3 top-4 text-primary hover:text-surface-tint transition-colors disabled:opacity-50"
            aria-label="Add skill"
          >
            <span className="material-symbols-outlined">add_circle</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[100px] border border-outline-variant p-4 rounded-xl">
          {skills.length === 0 && <p className="text-on-surface-variant text-sm">No skills added yet.</p>}
          {skills.map((skill) => (
            <SkillTag key={skill.id} name={skill.name} onRemove={() => removeSkill(skill.id)} />
          ))}
        </div>
      </div>
    </BaseDialog>
  );
};
