import React from 'react';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  profile: {
    id: string;
    username: string;
    displayName: string;
    headline: string;
    avatarUrl: string | null;
    likesCount: number;
    skills: string[];
  };
  index: number;
  onClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, index, onClick }) => {
  const initials = profile.displayName?.[0]?.toUpperCase() ?? '?';

  return (
    <motion.div
      onClick={onClick}
      className="p-5 rounded-xl bg-white border border-outline-variant/30 cursor-pointer hover:shadow-md transition-shadow group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className="flex items-start gap-3">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-2 ring-white shadow-sm">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
            {profile.displayName}
          </h3>
          <p className="text-xs text-on-surface-variant">@{profile.username}</p>
        </div>

        <div className="flex items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          <span className="text-xs font-medium">{profile.likesCount}</span>
        </div>
      </div>

      {profile.headline && (
        <p className="text-sm text-on-surface-variant mt-3 line-clamp-2">{profile.headline}</p>
      )}

      {profile.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface-variant"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 4 && (
            <span className="px-2 py-1 text-xs text-on-surface-variant">
              +{profile.skills.length - 4}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
