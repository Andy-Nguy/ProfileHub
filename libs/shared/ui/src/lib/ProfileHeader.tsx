import React from 'react';

export interface ProfileHeaderProps {
  avatarUrl?: string | null;
  coverUrl?: string | null;
  displayName: string;
  headline?: string | null;
  location?: string | null;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  avatarUrl, 
  coverUrl, 
  displayName, 
  headline, 
  location,
  className = ''
}) => {
  return (
    <div className={`bg-surface-container-lowest rounded-[16px] shadow-sm elevation-1 border border-surface-variant overflow-hidden ${className}`}>
      {/* Cover Image */}
      <div className="h-32 md:h-48 w-full bg-surface-variant relative">
        {coverUrl ? (
          <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container to-secondary-container opacity-50"></div>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 mb-4 gap-4">
          <div className="relative">
            <img 
              src={avatarUrl || 'https://via.placeholder.com/150'} 
              alt={displayName} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-surface-container-lowest bg-surface-container-lowest shadow-sm"
            />
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button className="bg-primary text-on-primary font-label-lg text-label-lg py-2 px-6 rounded-full hover:bg-primary-container transition-colors shadow-sm elevation-1">
              Connect
            </button>
            <button className="border border-outline-variant text-primary font-label-lg text-label-lg py-2 px-6 rounded-full hover:bg-surface-container-low transition-colors">
              Message
            </button>
          </div>
        </div>
        
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background font-bold">{displayName}</h1>
          {headline && <p className="font-title-lg text-title-lg text-on-surface-variant mt-1">{headline}</p>}
          {location && (
            <p className="font-body-lg text-body-lg text-outline mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
