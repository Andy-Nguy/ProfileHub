import { CookieOptions } from 'express';

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Build secure cookie options for the refresh token.
 *
 * Security decisions:
 * - httpOnly: prevents JavaScript access (XSS mitigation)
 * - secure: true in production (HTTPS only)
 * - sameSite: 'lax' in development (same-origin), 'none' in production
 *   (cross-origin for separate frontend domain)
 * - path restricted to /api/auth to prevent cookie from being sent
 *   on every request — only auth endpoints need it
 */
export function getRefreshCookieOptions(nodeEnv: string): CookieOptions {
  const isProduction = nodeEnv === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth',
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  };
}

export function getRefreshCookieName(): string {
  return REFRESH_COOKIE_NAME;
}

/**
 * Build cookie options to clear the refresh token cookie.
 */
export function getClearRefreshCookieOptions(nodeEnv: string): CookieOptions {
  const isProduction = nodeEnv === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth',
  };
}
