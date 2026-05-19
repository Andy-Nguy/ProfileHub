import React, { useState } from 'react';

export interface ProfileHeaderProps {
  avatarUrl?: string | null;
  coverUrl?: string | null;
  displayName: string;
  headline?: string | null;
  location?: string | null;
  className?: string;
  showActions?: boolean;
  isOwnProfile?: boolean;
  onAvatarClick?: () => void;
  avatarUploading?: boolean;
}

/** Generate a deterministic gradient based on display name */
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const GRADIENT_PAIRS = [
  ['#6366f1', '#8b5cf6'], // indigo → violet
  ['#3b82f6', '#06b6d4'], // blue → cyan
  ['#10b981', '#06b6d4'], // emerald → cyan
  ['#f59e0b', '#ef4444'], // amber → red
  ['#8b5cf6', '#ec4899'], // violet → pink
  ['#0ea5e9', '#6366f1'], // sky → indigo
];

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % GRADIENT_PAIRS.length;
  return GRADIENT_PAIRS[idx];
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  coverUrl,
  displayName,
  headline,
  location,
  className = '',
  showActions = true,
  isOwnProfile = false,
  onAvatarClick,
  avatarUploading = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const initials = getInitials(displayName || 'U');
  const [gradFrom, gradTo] = getGradient(displayName || 'U');
  const showFallback = !avatarUrl || imgError;

  return (
    <div
      className={`bg-surface-container-lowest rounded-[20px] shadow-sm elevation-1 border border-surface-variant overflow-hidden ${className}`}
    >
      {/* ── Cover ──────────────────────────────────── */}
      <div className="h-36 md:h-52 w-full relative overflow-hidden">
        {coverUrl && !coverError ? (
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
        ) : (
          /* Gradient cover fallback */
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${gradFrom}22 0%, ${gradTo}44 50%, ${gradFrom}11 100%)`,
            }}
          >
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, ${gradFrom} 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, ${gradTo} 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>
        )}
      </div>

      {/* ── Profile Info Row ──────────────────────── */}
      <div className="px-5 md:px-7 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-4">

          {/* Avatar */}
          <div
            className={`relative select-none ${isOwnProfile && !avatarUploading ? 'cursor-pointer group' : 'cursor-default'}`}
            onClick={isOwnProfile && !avatarUploading ? onAvatarClick : undefined}
            role={isOwnProfile && !avatarUploading ? 'button' : undefined}
            aria-label={isOwnProfile ? 'Edit profile photo' : undefined}
            tabIndex={isOwnProfile && !avatarUploading ? 0 : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isOwnProfile && !avatarUploading) onAvatarClick?.();
            }}
          >
            {/* White ring border */}
            <div
              className="rounded-full p-1 bg-white shadow-lg"
              style={{ display: 'inline-block' }}
            >
              {showFallback ? (
                /* Initials fallback */
                <div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-2xl md:text-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                    opacity: avatarUploading ? 0.6 : 1,
                  }}
                >
                  {initials}
                </div>
              ) : (
                <img
                  src={avatarUrl!}
                  alt={displayName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  style={{ opacity: avatarUploading ? 0.6 : 1 }}
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            {/* Upload spinner */}
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full border-4 border-white/30 border-t-white animate-spin" />
              </div>
            )}

            {/* Camera overlay (own profile, hover) */}
            {isOwnProfile && !avatarUploading && (
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ background: 'rgba(0,0,0,0.42)' }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontSize: '28px' }}
                  >
                    photo_camera
                  </span>
                  <span className="text-white text-[10px] font-medium tracking-wide">
                    EDIT
                  </span>
                </div>
              </div>
            )}

            {/* "Edit" badge (always visible on own profile, not uploading) */}
            {isOwnProfile && !avatarUploading && (
              <div
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '14px' }}>
                  edit
                </span>
              </div>
            )}
          </div>

          {/* Action buttons (for viewing others' profiles) */}
          {showActions && (
            <div className="flex gap-3 mt-4 sm:mt-0 pb-1">
              <button
                id="profile-connect-btn"
                className="bg-indigo-600 text-white text-sm font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Connect
              </button>
              <button
                id="profile-message-btn"
                className="border border-gray-200 text-gray-700 text-sm font-semibold py-2 px-6 rounded-full hover:bg-gray-50 transition-colors"
              >
                Message
              </button>
            </div>
          )}
        </div>

        {/* Name / Headline / Location */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{displayName}</h1>
          {headline && (
            <p className="text-gray-600 mt-1 text-sm md:text-base leading-snug">{headline}</p>
          )}
          {location && (
            <p className="flex items-center gap-1 text-gray-400 mt-2 text-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                location_on
              </span>
              {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
