import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useAuthSession,
  getStoredAuthSession,
  isAccessTokenFresh,
} from '../services/auth-session.service';
import { authAPI } from '../services/auth-login.service';
import { ApiError, setPendingAccessToken } from '../services/api.service';
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
      setPendingAccessToken(accessToken);
      try {
        const meRes = await authAPI.getMe();
        const latestToken =
          getStoredAuthSession()?.accessToken ?? accessToken;
        if (meRes?.user) {
          setSession({ accessToken: latestToken, user: meRes.user });
          setNeedsOnboarding(meRes.needsOnboarding ?? false);
          setProfileCompletion(meRes.profileCompletion ?? 0);
        } else {
          clearSession();
          setNeedsOnboarding(false);
          setProfileCompletion(0);
        }
      } finally {
        setPendingAccessToken(null);
      }
    },
    [setSession, clearSession],
  );

  // ── Bootstrap on mount ───────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const dropSession = () => {
      clearSession();
      setNeedsOnboarding(false);
      setProfileCompletion(0);
    };

    const shouldKeepSession = (tokenAtStart: string | undefined) => {
      const latest = getStoredAuthSession()?.accessToken;
      return !!latest && latest !== tokenAtStart;
    };

    const init = async () => {
      setIsLoading(true);
      const tokenAtStart = session?.accessToken;

      try {
        if (tokenAtStart && isAccessTokenFresh(tokenAtStart)) {
          try {
            await fetchAndApplyProfile(tokenAtStart);
          } catch (err) {
            if (cancelled || shouldKeepSession(tokenAtStart)) {
              return;
            }
            const status =
              err instanceof ApiError ? err.response?.status : undefined;
            if (status === 409) {
              return;
            }
            dropSession();
          }
          return;
        }

        try {
          const refreshRes = await authAPI.refresh();
          if (cancelled) {
            return;
          }
          if (refreshRes?.accessToken) {
            await fetchAndApplyProfile(refreshRes.accessToken);
          } else if (!shouldKeepSession(tokenAtStart)) {
            dropSession();
          }
        } catch (err) {
          if (cancelled || shouldKeepSession(tokenAtStart)) {
            return;
          }
          const status =
            err instanceof ApiError ? err.response?.status : undefined;
          if (status === 409) {
            return;
          }
          dropSession();
        }
      } catch {
        if (!cancelled && !shouldKeepSession(tokenAtStart)) {
          dropSession();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    init();
    return () => {
      cancelled = true;
    };
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
