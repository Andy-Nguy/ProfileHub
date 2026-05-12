import React from 'react';
import { FloatingField, FloatingTextarea } from '../shared/FloatingField';

interface PersonalInfoSectionProps {
  firstName?: string;
  lastName?: string;
  headline?: string;
  bio?: string;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  firstName = 'Jane',
  lastName = 'Doe',
  headline = 'Senior Product Designer | UI/UX Specialist',
  bio = '',
}) => {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}>
      <h3 className="font-title-lg text-title-lg text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">person</span>
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FloatingField id="firstName" label="First Name" defaultValue={firstName} />
        <FloatingField id="lastName" label="Last Name" defaultValue={lastName} />
      </div>

      <FloatingField
        id="headline"
        label="Professional Headline"
        defaultValue={headline}
        className="mb-4"
      />

      <FloatingTextarea id="bio" label="Bio Summary" defaultValue={bio} rows={4} />
    </section>
  );
};
