import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { useAuthSession } from '../../services/auth-session.service';
import { useAuth } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks/useApi';
import { Button } from '../shared/Button';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { Logo } from '../shared/Logo';

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
        className="bg-white/70 backdrop-blur-xl flex justify-between items-center h-14 px-6 w-full sticky top-0 z-50 border-b border-slate-200/60"
      >
        <div className="flex items-center gap-8 w-full">
          {/* Mobile Menu Toggle */}
          {isAuthenticated && (
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden text-slate-500 hover:bg-slate-100 rounded-full p-2 transition-all"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          )}

          {/* Logo */}
          <div className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
          </div>

          {/* Desktop Nav - Airy & Refined */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {[
              { to: '/discovery', label: t('nav.discover') },
              { to: '/network', label: t('nav.network') },
              { to: '/resources', label: t('nav.resources') },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-1 text-sm font-medium transition-all duration-300 group ${
                  location.pathname === item.to
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
                {location.pathname === item.to && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 rounded-full" />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-400 rounded-full transition-all duration-300 group-hover:w-full"
                      style={{ zIndex: location.pathname === item.to ? -1 : 1 }} />
              </Link>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="hidden sm:flex text-slate-400 hover:text-slate-600 transition-colors relative group">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <LanguageSwitcher className="hidden sm:flex" />

            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-slate-600 px-4 py-2 rounded-full hover:bg-slate-100 transition-all active:scale-95"
                >
                  {t('nav.signIn')}
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                >
                  {t('nav.joinNow')}
                </button>
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100 transition-all active:scale-95"
                >
                  <div className="relative">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300">
                      {userInitial}
                    </span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <span className="hidden sm:block text-left">
                    <span className="block text-sm font-medium text-slate-900 leading-none">
                      {displayName}
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '18px' }}>
                    {isMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="border-b border-slate-50 px-4 py-3 bg-slate-50/50">
                      <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="border-b border-slate-50 px-4 py-3 flex items-center justify-between sm:hidden bg-white">
                      <span className="text-xs text-slate-500">{t('language.label')}</span>
                      <LanguageSwitcher />
                    </div>
                    <Button
                      type="button"
                      onClick={handleLogout}
                      isLoading={logoutMutation.isPending}
                      loadingText={t('nav.loggingOut')}
                      icon={<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>}
                      className="w-full gap-3 px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors bg-white border-none"
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

      {/* Left Mobile Navigation Drawer */}
      {isMobileNavOpen &&
        createPortal(
          <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <aside
              className="absolute inset-y-0 left-0 w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out"
              style={{ animation: 'slideInLeft 0.25s ease-out' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                <div onClick={() => setIsMobileNavOpen(false)}>
                  <Logo size="md" to="/" />
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                </button>
              </div>

              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{displayName}</h3>
                  <p className="text-xs text-slate-500 truncate">Workspace member</p>
                </div>
              </div>

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
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

              <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                <button
                  className="w-full bg-slate-900 text-white font-medium text-sm py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    setIsMobileNavOpen(false);
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

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
