import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { useAuthSession } from '../../services/auth-session.service';
import { useAuth } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks/useApi';
import { Button } from '../shared/Button';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

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

export const TopAppBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthSession();
  const { deauthenticate } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const logoutMutation = useLogout();
  const { t } = useTranslation('common');

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const displayName = user?.displayName || user?.username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      deauthenticate();
      setIsMenuOpen(false);
      setIsMobileNavOpen(false);
      navigate('/');
    }
  };

  return (
    <>
      <header
        className="bg-surface shadow-sm flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-50"
        style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)' }}
      >
        <div className="flex items-center gap-4 w-full">
          {/* Mobile Menu Toggle - opens Left Drawer */}
          {isAuthenticated && (
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-all"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:ml-2 shrink-0" aria-label="ProHub Home">
            <img
              src="/logo.png"
              alt="ProHub logo"
              className="h-8 w-8 rounded-lg object-cover shadow-sm"
              draggable={false}
            />
            <span className="font-title-lg text-title-lg font-bold text-primary">
              ProHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 ml-8">
            <Link
              to="/discovery"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
            >
              {t('nav.discover')}
            </Link>
            <Link
              to="/network"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
            >
              {t('nav.network')}
            </Link>
            <Link
              to="/resources"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
            >
              {t('nav.resources')}
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language Switcher — always visible on desktop */}
            <LanguageSwitcher className="hidden sm:flex" />

            {!isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-primary font-label-lg text-label-lg px-6 py-2 rounded-full hover:bg-surface-container-low transition-colors"
                  >
                    {t('nav.signIn')}
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-primary text-on-primary font-label-lg text-label-lg px-6 py-2 rounded-full hover:bg-surface-tint transition-colors shadow-sm"
                  >
                    {t('nav.joinNow')}
                  </button>
                </div>
                {/* Mobile login icon for space saving */}
                <button
                  onClick={() => navigate('/login')}
                  className="md:hidden text-primary p-2 hover:bg-surface-container-low rounded-full transition-all"
                >
                  <span className="material-symbols-outlined">login</span>
                </button>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className="flex items-center gap-3 rounded-full border border-outline-variant bg-surface px-3 py-2 hover:bg-surface-container-low transition-colors"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary font-bold">
                    {userInitial}
                  </span>
                  <span className="hidden sm:block text-left">
                    <span className="block font-label-lg text-label-lg text-on-surface">
                      {displayName}
                    </span>
                    <span className="block text-xs text-on-surface-variant">{t('nav.account')}</span>
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {isMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Right Profile Dropdown - ONLY for Account details, Language, and Logout */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-xl z-50">
                    <div className="border-b border-outline-variant px-4 py-3 bg-gray-50/50">
                      <p className="font-label-lg text-label-lg text-on-surface truncate">{displayName}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                    </div>
                    {/* Language switcher inside the dropdown for mobile */}
                    <div className="border-b border-outline-variant px-4 py-3 flex items-center justify-between sm:hidden bg-white">
                      <span className="text-sm text-on-surface-variant">{t('language.label')}</span>
                      <LanguageSwitcher />
                    </div>
                    <Button
                      type="button"
                      onClick={handleLogout}
                      isLoading={logoutMutation.isPending}
                      loadingText={t('nav.loggingOut')}
                      icon={<span className="material-symbols-outlined">logout</span>}
                      className="w-full gap-3 px-4 py-3 text-left font-label-lg text-label-lg text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors bg-white"
                    >
                      {t('nav.logout')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Left Mobile Navigation Drawer (Integrated Hamburger Drawer) */}
      {isMobileNavOpen &&
        createPortal(
          <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true">
            {/* Backdrop Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Slide-in Menu Panel */}
            <aside
              className="absolute inset-y-0 left-0 w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out"
              style={{ animation: 'slideInLeft 0.25s ease-out' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-surface">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="ProHub logo"
                    className="h-8 w-8 rounded-lg object-cover shadow-sm"
                    draggable={false}
                  />
                  <span className="font-title-lg text-title-lg font-bold text-primary">ProHub</span>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                </button>
              </div>

              {/* User Minimal Card inside Drawer */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-sm shadow-inner">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{displayName}</h3>
                  <p className="text-xs text-gray-500 truncate">Workspace member</p>
                </div>
              </div>

              {/* Nav Items List */}
              <nav className="flex-1 px-3 py-4 space-y-1 bg-white overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    location.pathname === item.to ||
                    (item.to === '/discovery' && location.pathname.startsWith('/u/'));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileNavOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-secondary-container text-on-secondary-container font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="material-symbols-outlined mr-3 text-current" style={{ fontSize: '22px' }}>
                        {item.icon}
                      </span>
                      <span className="text-sm">{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Big Share Button inside Drawer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                <button
                  className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-3 rounded-xl hover:bg-primary/95 transition-colors shadow-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    // trigger share action (can log or expand later)
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
                  {t('nav.sharePortfolio')}
                </button>
              </div>
            </aside>
          </div>,
          document.body
        )}

      {/* Slide in animation style */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
