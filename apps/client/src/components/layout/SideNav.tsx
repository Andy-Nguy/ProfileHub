import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

export const SideNav: React.FC<SideNavProps> = ({
  user = {
    name: 'Hub Workspace',
    level: 'Expertise Level: Senior',
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
  },
}) => {
  const location = useLocation();
  const { t } = useTranslation('common');

  return (
    <aside className="hidden md:flex flex-col py-[32px] space-y-[8px] fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto bg-surface-container-low shadow-md w-72 z-40">
      {/* User Info */}
      <div className="px-gutter mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatarUrl}
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="font-title-lg text-title-lg font-bold text-primary">{user.name}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{user.level}</p>
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

      {/* Share Button */}
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
