import React, { useState } from 'react';
import { ToggleSwitch } from '../shared/ToggleSwitch';

interface VisibilityCardProps {
  defaultPublic?: boolean;
}

export const VisibilityCard: React.FC<VisibilityCardProps> = ({ defaultPublic = true }) => {
  const [isPublic, setIsPublic] = useState(defaultPublic);

  return (
    <section className="bg-primary-fixed rounded-xl p-6"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}>
      <h3 className="font-title-lg text-title-lg text-on-primary-fixed mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-on-primary-fixed">visibility</span>
        Profile Visibility
      </h3>
      <p className="font-body-lg text-body-lg text-on-primary-fixed-variant mb-4">
        Your profile is currently {isPublic ? 'public' : 'private'} and{' '}
        {isPublic
          ? 'visible to the entire ProHub network.'
          : 'only visible to you.'}
      </p>
      <ToggleSwitch
        checked={isPublic}
        onChange={setIsPublic}
        label="Public Mode"
        className="text-on-primary-fixed"
      />
    </section>
  );
};
