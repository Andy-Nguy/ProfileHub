import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthSession } from '../services/auth-session.service';
import { authAPI } from '../services/auth-login.service';
import { AuthUser } from '../../../../libs/shared/types/auth.types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, setSession, clearSession } = useAuthSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        let meRes = null;
        let token = session?.accessToken;

        // Step 1: Try to get user profile with existing access token
        if (token) {
          try {
            meRes = await authAPI.getMe();
          } catch (err: any) {
            // If the token is expired, we will get a 401. We will catch it and proceed to refresh.
            if (err?.response?.status !== 401) {
              // If it's another error (e.g. 500, network error), we might still want to clear or throw,
              // but let's assume we need to refresh or clear.
            }
          }
        }

        // Step 2: If we don't have user data (no token, or token expired), try to refresh
        if (!meRes?.user) {
          const refreshRes = await authAPI.refresh();

          if (refreshRes?.accessToken) {
            token = refreshRes.accessToken;
            // Temporarily save token so ApiClient uses it for the next request
            setSession({ accessToken: token, user: session?.user ?? (null as any) });

            // Step 3: Get user data with the fresh token
            meRes = await authAPI.getMe();
          }
        }

        // Step 4: Finalize session state
        if (meRes?.user && token) {
          setSession({
            accessToken: token,
            user: meRes.user,
          });
        } else {
          clearSession();
        }
      } catch (err) {
        // Silently clear session if completely fails
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!session?.user, isLoading, user: session?.user ?? null }}
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
