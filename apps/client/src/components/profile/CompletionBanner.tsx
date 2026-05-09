import React from 'react';

interface CompletionBannerProps {
  percent: number;
  message?: string;
}

export const CompletionBanner: React.FC<CompletionBannerProps> = ({
  percent,
  message = 'Add your latest projects to reach 100%.',
}) => {
  return (
    <div className="bg-surface-container rounded-lg p-6 shadow-sm"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}>
      <div className="flex justify-between items-center mb-3">
        <span className="font-title-lg text-title-lg text-on-surface">Profile Completion</span>
        <span className="font-title-lg text-title-lg text-primary font-bold">{percent}%</span>
      </div>
      <div className="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-on-surface-variant font-label-lg text-label-lg mt-3">{message}</p>
    </div>
  );
};
