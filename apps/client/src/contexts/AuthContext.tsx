import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthSession } from '../services/auth-session.service';
import { authAPI } from '../services/auth-login.service';
import { AuthUser } from '../../../../libs/shared/types/auth.types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  needsOnboarding: boolean;
  profileCompletion: number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, setSession, clearSession } = useAuthSession();
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

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
            if (err?.response?.status !== 401) {
              // Handle other errors if needed
            }
          }
        }

        // Step 2: If we don't have user data, try to refresh
        if (!meRes?.user) {
          try {
            const refreshRes = await authAPI.refresh();
            if (refreshRes?.accessToken) {
              token = refreshRes.accessToken;
              // We need to set the session temporarily so getMe uses the new token
              // Or better, pass the token to getMe if it supported it.
              // For now, let's just rely on the fact that we'll set it at the end.
              // But apiClient reads from localStorage, so we MUST save it.
              setSession({ accessToken: token, user: session?.user ?? (null as any) });
              meRes = await authAPI.getMe();
            }
          } catch (refreshErr) {
            // Refresh failed, clear everything
            clearSession();
            return;
          }
        }

        // Step 3: Finalize session state
        if (meRes?.user && token) {
          setSession({
            accessToken: token,
            user: meRes.user,
          });
          setNeedsOnboarding(meRes.needsOnboarding);
          setProfileCompletion(meRes.profileCompletion);
        } else {
          clearSession();
          setNeedsOnboarding(false);
          setProfileCompletion(0);
        }
      } catch (err) {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.user,
        isLoading,
        user: session?.user ?? null,
        needsOnboarding,
        profileCompletion
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
