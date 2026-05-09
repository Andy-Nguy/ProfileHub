import React from 'react';

interface SkillTagProps {
  name: string;
  onRemove?: () => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({ name, onRemove }) => {
  return (
    <div className="inline-flex items-center bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 hover:bg-surface-variant transition-colors group">
      <span className="font-label-lg text-label-lg text-on-surface mr-2">{name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-on-surface-variant hover:text-error transition-colors"
          aria-label={`Remove ${name}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
        </button>
      )}
    </div>
  );
};
