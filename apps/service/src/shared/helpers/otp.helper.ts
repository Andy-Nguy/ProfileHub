import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const SALT_ROUNDS = 12;

/**
 * Generate a cryptographically secure 6-digit OTP.
 * Uses crypto.randomInt instead of Math.random for security.
 */
export function generateOtp(): string {
  return crypto.randomInt(100_000, 999_999).toString();
}

/**
 * Hash an OTP code using bcrypt.
 * The raw OTP is NEVER stored — only the hash.
 */
export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, SALT_ROUNDS);
}

/**
 * Verify an OTP against its bcrypt hash.
 * Uses constant-time comparison internally (bcrypt.compare).
 */
export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}
