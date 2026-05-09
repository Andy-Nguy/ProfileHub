import React from 'react';

export interface SkillChipProps {
  name: string;
  onRemove?: () => void;
  className?: string;
}

export const SkillChip: React.FC<SkillChipProps> = ({ name, onRemove, className = '' }) => {
  return (
    <div 
      className={`inline-flex items-center bg-surface-container border border-outline-variant rounded-full px-3 py-1.5 hover:bg-surface-variant transition-colors group ${className}`}
    >
      <span className="font-label-lg text-label-lg text-on-surface mr-2">{name}</span>
      {onRemove && (
        <span 
          className="material-symbols-outlined text-sm text-on-surface-variant cursor-pointer hover:text-error transition-colors" 
          style={{ fontSize: '16px' }}
          onClick={onRemove}
          role="button"
          aria-label={`Remove ${name} skill`}
        >
          close
        </span>
      )}
    </div>
  );
};
