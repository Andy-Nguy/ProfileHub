import React, { useState } from 'react';

export interface ProfileSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ProfileHeaderProps {
  avatarUrl?: string | null;
  coverUrl?: string | null;
  displayName: string;
  headline?: string | null;
  location?: string | null;
  industry?: string | null;
  username?: string | null;
  socialLinks?: ProfileSocialLink[];
  connectionCount?: number;
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
    .filter(Boolean)
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

// Map platform names to Material Symbols icons + colors
const SOCIAL_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  github:   { icon: 'code',        label: 'GitHub',   color: '#24292e' },
  linkedin: { icon: 'work',        label: 'LinkedIn', color: '#0a66c2' },
  twitter:  { icon: 'chat',        label: 'Twitter',  color: '#1d9bf0' },
  dribbble: { icon: 'sports_basketball', label: 'Dribbble', color: '#ea4c89' },
  personal: { icon: 'language',    label: 'Website',  color: '#6366f1' },
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  coverUrl,
  displayName,
  headline,
  location,
  industry,
  username,
  socialLinks = [],
  connectionCount,
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
      className={`bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      {/* ── Cover Banner ─────────────────────────────── */}
      <div className="h-32 md:h-44 w-full relative overflow-hidden">
        {coverUrl && !coverError ? (
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${gradFrom}33 0%, ${gradTo}55 50%, ${gradFrom}22 100%)`,
            }}
          >
            {/* Subtle dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `radial-gradient(circle, ${gradFrom} 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
            {/* Glow blobs */}
            <div
              className="absolute -top-8 -left-8 w-48 h-48 rounded-full opacity-30 blur-3xl"
              style={{ background: gradFrom }}
            />
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full opacity-20 blur-3xl"
              style={{ background: gradTo }}
            />
          </div>
        )}
      </div>

      {/* ── Profile Info ──────────────────────────────── */}
      <div className="px-5 md:px-7 pb-6 relative">
        {/* Avatar + Action row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 md:-mt-14 mb-4 gap-4">
          {/* Avatar */}
          <div
            className={`relative flex-shrink-0 w-24 h-24 md:w-28 md:h-28 ${
              isOwnProfile && !avatarUploading ? 'cursor-pointer group' : 'cursor-default'
            }`}
            onClick={isOwnProfile && !avatarUploading ? onAvatarClick : undefined}
            role={isOwnProfile && !avatarUploading ? 'button' : undefined}
            aria-label={isOwnProfile ? 'Edit profile photo' : undefined}
            tabIndex={isOwnProfile && !avatarUploading ? 0 : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isOwnProfile && !avatarUploading) onAvatarClick?.();
            }}
          >
            {showFallback ? (
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-2xl md:text-3xl border-[3px] border-white shadow-md"
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
                className="w-full h-full rounded-full object-cover border-[3px] border-white shadow-md"
                style={{ opacity: avatarUploading ? 0.6 : 1 }}
                onError={() => setImgError(true)}
              />
            )}

            {/* Upload spinner */}
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
              </div>
            )}

            {/* Camera overlay */}
            {isOwnProfile && !avatarUploading && (
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ background: 'rgba(0,0,0,0.42)' }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                    photo_camera
                  </span>
                  <span className="text-white text-[10px] font-medium tracking-wide">EDIT</span>
                </div>
              </div>
            )}

            {/* Edit badge */}
            {isOwnProfile && !avatarUploading && (
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10"
                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '12px' }}>edit</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className="flex gap-2.5 mt-2 sm:mt-0 pb-1">
              <button
                id="profile-connect-btn"
                className="flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold py-2 px-5 rounded-full hover:opacity-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person_add</span>
                Connect
              </button>
              <button
                id="profile-message-btn"
                className="flex items-center gap-2 border border-outline-variant text-on-surface text-sm font-semibold py-2 px-5 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                Message
              </button>
            </div>
          )}
        </div>

        {/* Name + Handle + Headline */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-on-surface leading-tight">{displayName}</h1>
            {username && (
              <span className="text-sm text-on-surface-variant/70 font-medium">@{username}</span>
            )}
          </div>

          {headline && (
            <p className="text-sm md:text-base text-on-surface-variant leading-snug">{headline}</p>
          )}

          {/* Meta row: location, industry, connections */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            {location && (
              <span className="flex items-center gap-1 text-xs text-on-surface-variant/70">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                {location}
              </span>
            )}
            {industry && (
              <span className="flex items-center gap-1 text-xs text-on-surface-variant/70">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>business</span>
                {industry}
              </span>
            )}
            {connectionCount !== undefined && connectionCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
                {connectionCount}+ connections
              </span>
            )}
          </div>

          {/* Social Links inline */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {socialLinks.map((link) => {
                const config = SOCIAL_CONFIG[link.platform.toLowerCase()] ?? {
                  icon: 'link',
                  label: link.platform,
                  color: '#6366f1',
                };
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={config.label}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-outline-variant text-xs font-medium text-on-surface-variant hover:border-primary hover:text-primary transition-all group"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: config.color }}>
                      {config.icon}
                    </span>
                    <span className="group-hover:underline">{config.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
