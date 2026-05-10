import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash a refresh token using bcrypt.
 * Raw refresh tokens are NEVER stored in the database.
 */
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, SALT_ROUNDS);
}

/**
 * Verify a raw refresh token against its bcrypt hash.
 */
export async function verifyToken(
  token: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Generate a cryptographically secure random JTI (JWT ID).
 */
export function generateJti(): string {
  return crypto.randomUUID();
}
