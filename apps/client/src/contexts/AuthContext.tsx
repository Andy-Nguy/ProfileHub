import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuthSession } from '../services/auth-session.service';
import { authAPI } from '../services/auth-login.service';
import { AuthUser } from '@profilehub/types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  needsOnboarding: boolean;
  profileCompletion: number;
  /**
   * Call this after a successful login to hydrate the auth context
   * without a full page reload. Accepts the accessToken + basic user
   * returned from the login response, then fetches the full /auth/me
   * data to ensure profile info is up to date.
   */
  authenticate: (accessToken: string, user: AuthUser) => Promise<void>;
  /**
   * Call this to clear the session (logout).
   */
  deauthenticate: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session, setSession, clearSession } = useAuthSession();
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // ── Helpers ──────────────────────────────────────────────────────────

  /**
   * Fetch /auth/me and update the context state.
   * Requires a valid access token already in localStorage.
   */
  const fetchAndApplyProfile = useCallback(
    async (accessToken: string) => {
      const meRes = await authAPI.getMe();
      if (meRes?.user) {
        setSession({ accessToken, user: meRes.user });
        setNeedsOnboarding(meRes.needsOnboarding ?? false);
        setProfileCompletion(meRes.profileCompletion ?? 0);
      } else {
        clearSession();
        setNeedsOnboarding(false);
        setProfileCompletion(0);
      }
    },
    [setSession, clearSession],
  );

  // ── Bootstrap on mount ───────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const existingToken = session?.accessToken;

        if (existingToken) {
          // Access token exists in storage.
          // apiClient will automatically refresh it via the 401 interceptor
          // if it has expired, so a single getMe() call is sufficient.
          // If getMe() still throws after an internal refresh attempt, the
          // interceptor redirects to /login — we just clear local state here.
          try {
            await fetchAndApplyProfile(existingToken);
          } catch {
            // Both the original getMe() AND the interceptor's refresh attempt
            // failed. Session is unrecoverable — clear it.
            clearSession();
            setNeedsOnboarding(false);
            setProfileCompletion(0);
          }
          return;
        }

        // No stored access token — could be a fresh visit with a valid
        // refresh cookie from a previous session (e.g., after clearing localStorage).
        // Try to get a new access token via the httpOnly cookie.
        try {
          const refreshRes = await authAPI.refresh();
          if (refreshRes?.accessToken) {
            await fetchAndApplyProfile(refreshRes.accessToken);
          } else {
            clearSession();
          }
        } catch {
          // No valid refresh cookie either — user is logged out.
          clearSession();
          setNeedsOnboarding(false);
          setProfileCompletion(0);
        }
      } catch {
        clearSession();
        setNeedsOnboarding(false);
        setProfileCompletion(0);
      } finally {
        setIsLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally runs once on mount only

  // ── Public methods ───────────────────────────────────────────────────

  /**
   * Called by LoginPage after a successful login response.
   * Saves the access token + user immediately (optimistic update),
   * then re-fetches /auth/me for the canonical profile data.
   * No page reload required.
   */
  const authenticate = useCallback(
    async (accessToken: string, user: AuthUser) => {
      // Optimistically set session so the UI can respond immediately
      setSession({ accessToken, user });
      setIsLoading(true);
      try {
        await fetchAndApplyProfile(accessToken);
      } finally {
        setIsLoading(false);
      }
    },
    [setSession, fetchAndApplyProfile],
  );

  /**
   * Clears the local session state. The caller is responsible for
   * also calling POST /auth/logout to revoke the refresh token cookie.
   */
  const deauthenticate = useCallback(() => {
    clearSession();
    setNeedsOnboarding(false);
    setProfileCompletion(0);
  }, [clearSession]);

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.user,
        isLoading,
        user: session?.user ?? null,
        needsOnboarding,
        profileCompletion,
        authenticate,
        deauthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
