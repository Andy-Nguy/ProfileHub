import { useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  displayName?: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

const AUTH_STORAGE_KEY = 'profilehub.auth';
const AUTH_SESSION_EVENT = 'profilehub-auth-changed';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readAuthSession(): AuthSession | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawSession ? (JSON.parse(rawSession) as AuthSession) : null;
  } catch {
    return null;
  }
}

function writeAuthSession(session: AuthSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getStoredAuthSession() {
  return readAuthSession();
}

export function setStoredAuthSession(session: AuthSession) {
  writeAuthSession(session);
}

export function removeStoredAuthSession() {
  clearAuthSession();
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(() => readAuthSession());

  useEffect(() => {
    const syncSession = () => {
      setSession(readAuthSession());
    };

    window.addEventListener('storage', syncSession);
    window.addEventListener(AUTH_SESSION_EVENT, syncSession);

    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener(AUTH_SESSION_EVENT, syncSession);
    };
  }, []);

  return useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: !!session,
      setSession: setStoredAuthSession,
      clearSession: removeStoredAuthSession,
    }),
    [session],
  );
}
