import React from 'react';

interface SkillChipProps {
  name: string;
  count?: number;
}

export const SkillChip: React.FC<SkillChipProps> = ({ name, count }) => {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-sm font-medium text-primary">
      {name}
      {count !== undefined && count > 0 && (
        <span className="text-xs bg-primary/10 px-1.5 py-0.5 rounded-full font-bold">
          {count}
        </span>
      )}
    </span>
  );
};
