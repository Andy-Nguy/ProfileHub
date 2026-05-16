import * as crypto from 'crypto';

/**
 * Hash a refresh token using SHA-256.
 *
 * Why NOT bcrypt here:
 * - bcrypt silently truncates input at 72 bytes; a JWT is 500-1000+ bytes,
 *   meaning bcrypt would only hash the header/partial-payload — NOT the signature.
 * - Refresh tokens are cryptographically random (signed by JWT secret),
 *   so they do not need brute-force protection — a fast hash is correct.
 * - SHA-256 is constant-time via crypto and covers the full token.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a raw refresh token against its SHA-256 hash.
 * Uses a constant-time comparison to prevent timing attacks.
 */
export function verifyToken(token: string, hash: string): boolean {
  const expected = hashToken(token);
  // timingSafeEqual requires same-length Buffers
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Generate a cryptographically secure random JTI (JWT ID).
 */
export function generateJti(): string {
  return crypto.randomUUID();
}
