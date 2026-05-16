import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthSession } from '../../services/auth-session.service';
import { useAuth } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks/useApi';
import { Button } from '../shared/Button';

export const TopAppBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthSession();
  const { deauthenticate } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const logoutMutation = useLogout();

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const displayName = user?.displayName || user?.username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      deauthenticate();
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <header
      className="bg-surface shadow-sm flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-50"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)' }}
    >
      <div className="flex items-center gap-4 w-full">
        {/* Mobile Menu Toggle (representation) */}
        <button className="md:hidden text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-all">
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Logo */}
        <Link to="/" className="font-title-lg text-title-lg font-bold text-primary md:ml-2">
          ProHub
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 ml-8">
          <Link
            to="/discovery"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
          >
            Discover
          </Link>
          <Link
            to="/network"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
          >
            Network
          </Link>
          <Link
            to="/resources"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
          >
            Resources
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {!isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary font-label-lg text-label-lg px-6 py-2 rounded-full hover:bg-surface-container-low transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-primary text-on-primary font-label-lg text-label-lg px-6 py-2 rounded-full hover:bg-surface-tint transition-colors shadow-sm"
                >
                  Join Now
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
                  <span className="block text-xs text-on-surface-variant">Account</span>
                </span>
                <span className="material-symbols-outlined text-on-surface-variant">
                  {isMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-xl">
                  <div className="border-b border-outline-variant px-4 py-3">
                    <p className="font-label-lg text-label-lg text-on-surface">{displayName}</p>
                    <p className="text-sm text-on-surface-variant">{user?.email}</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleLogout}
                    isLoading={logoutMutation.isPending}
                    loadingText="Logging out..."
                    icon={<span className="material-symbols-outlined">logout</span>}
                    className="w-full gap-3 px-4 py-3 text-left font-label-lg text-label-lg text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
