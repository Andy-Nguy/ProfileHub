import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthSession } from '../../services/auth-session.service';
import { profileAPI } from '../../services/profile.service';

interface NavItem {
  icon: string;
  labelKey: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'account_circle', labelKey: 'nav.myProfile', to: '/profile' },
  { icon: 'explore',        labelKey: 'nav.discover',  to: '/discovery' },
  { icon: 'mail',           labelKey: 'nav.messages',  to: '/messages' },
  { icon: 'insights',       labelKey: 'nav.analytics', to: '/analytics' },
  { icon: 'settings',       labelKey: 'nav.settings',  to: '/settings' },
];

interface SideNavProps {
  user?: {
    name: string;
    level: string;
    avatarUrl: string;
  };
}

export const SideNav: React.FC<SideNavProps> = ({ user }) => {
  const { user: authUser, isAuthenticated } = useAuthSession();
  const location = useLocation();
  const { t } = useTranslation('common');
  const [profile, setProfile] = useState<any>(null);

  // Fetch the canonical user profile from the database if logged in
  useEffect(() => {
    if (isAuthenticated) {
      profileAPI.getMyProfile()
        .then((data) => {
          setProfile(data);
        })
        .catch((err) => {
          console.error('Failed to load profile in SideNav:', err);
        });
    } else {
      setProfile(null);
    }
  }, [isAuthenticated]);

  // Workspace brand name (always persistent)
  const workspaceName = 'Hub Workspace';

  // Dynamic user data for the top card layout with robust fallbacks
  const authUserAny = authUser as any;
  const userName =
    user?.name ||
    profile?.displayName ||
    (isAuthenticated && (authUserAny?.profile?.displayName || authUserAny?.displayName || authUserAny?.username)) ||
    'Expertise Level: Senior';

  const userAvatarUrl =
    user?.avatarUrl ||
    profile?.avatarUrl ||
    (isAuthenticated && authUserAny?.profile?.avatarUrl) ||
    (isAuthenticated && authUserAny?.username
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUserAny.username}`
      : 'https://i.pravatar.cc/150?u=1');

  return (
    <aside className="hidden md:flex flex-col py-[32px] space-y-[8px] fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto bg-surface-container-low shadow-md w-72 z-40">
      {/* Workspace Brand Widget (Static Title, Dynamic User Info) */}
      <div className="px-4 mb-6">
        <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-gradient-to-br from-surface-container-lowest to-surface-container-high/60 border border-outline-variant/60 shadow-md relative overflow-hidden">
          {/* Decorative Subtle Background Glow */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/5 blur-xl pointer-events-none" />
          
          {/* Avatar Container with Sleek Glow Ring & Live Dot */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/25 opacity-80 scale-105 blur-[2px]" />
            <img
              src={userAvatarUrl}
              alt="Hub Workspace"
              className="w-14 h-14 rounded-full object-cover bg-surface-container-highest relative z-10 border-2 border-surface shadow-inner"
            />
            {isAuthenticated && (
              <span className="absolute bottom-0 right-0 z-20 block h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-surface shadow-sm animate-pulse" />
            )}
          </div>

          {/* Workspace Details */}
          <div className="min-w-0 flex-1 relative z-10">
            <h2 className="text-[17px] font-extrabold text-on-surface tracking-tight truncate leading-tight">
              {workspaceName}
            </h2>
            
            <p className="text-xs text-on-surface-variant font-semibold tracking-wide truncate mt-1 flex items-center space-x-0.5" title={userName}>
              <span className="text-secondary select-none font-bold text-sm">@</span>
              <span className="opacity-90">{userName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col space-y-2">
        {NAV_ITEMS.map((item) => {
          // Mark profile-related routes as active together
          const isActive =
            location.pathname === item.to ||
            (item.to === '/discovery' && location.pathname.startsWith('/u/'));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full mx-2 flex items-center px-4 py-3 group transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              <span className="font-label-lg text-label-lg">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Share Portfolio Button */}
      <div className="px-gutter mt-auto pt-6">
        <button
          className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-3 rounded-full hover:bg-surface-tint transition-colors shadow-sm flex items-center justify-center gap-2"
          style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.1)' }}
        >
          <span className="material-symbols-outlined text-sm" style={{ fontSize: '18px' }}>share</span>
          {t('nav.sharePortfolio')}
        </button>
      </div>
    </aside>
  );
};
