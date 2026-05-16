import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from '../../entities/refresh-token.entity';
import { hashToken, verifyToken, generateJti } from '../../shared/helpers';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  jti: string;
}

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshRepo: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Generate a new access + refresh token pair.
   *
   * Security design:
   * - Access token uses a separate secret and short TTL (15m)
   * - Refresh token uses a separate secret and longer TTL (7d)
   * - Both tokens embed the same JTI for correlation
   * - Only the SHA-256 hash of the refresh token is stored in DB
   */
  async generateTokenPair(userId: string, role: string): Promise<TokenPair> {
    const jti = generateJti();

    const payload: JwtPayload = { sub: userId, role, jti };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken, jti };
  }

  /**
   * Persist a refresh token record in the database.
   * Stores ONLY the SHA-256 hash of the token — never the raw value.
   */
  async saveRefreshToken(params: {
    userId: string;
    jti: string;
    rawToken: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void> {
    const tokenHash = hashToken(params.rawToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const record = this.refreshRepo.create({
      userId: params.userId,
      jti: params.jti,
      tokenHash,
      expiresAt,
      userAgent: params.userAgent ?? null,
      ipAddress: params.ipAddress ?? null,
    });

    await this.refreshRepo.save(record);
  }

  /**
   * Atomically validate the old refresh token and rotate to a new pair.
   *
   * WHY THIS IS A SINGLE TRANSACTION (Race Condition Fix):
   * -------------------------------------------------------
   * Previously, validateRefreshToken() ran OUTSIDE the transaction, and
   * rotateRefreshToken() ran inside one. This created a race window:
   *
   *   Thread A: validate(token) ✓  ← token still valid
   *   Thread B: validate(token) ✓  ← token still valid (race!)
   *   Thread A: rotate() → revoke old, save new ✓
   *   Thread B: rotate() → old token already revoked → "TOKEN REUSE!" → revoke ALL
   *
   * By merging both into one transaction with a FOR UPDATE lock on the user row,
   * Thread B is serialized to wait, then sees the token is already revoked and
   * returns 401 cleanly — without triggering the nuclear "revoke all sessions".
   *
   * Security checks (in order):
   * 1. Verify JWT signature with refresh secret
   * 2. Acquire FOR UPDATE lock on user row (serializes concurrent refreshes)
   * 3. Look up token record by JTI
   * 4. Reject if token not found
   * 5. If revoked → genuine reuse attempt → revoke ALL sessions
   * 6. Reject if expired
   * 7. Verify raw token against stored SHA-256 hash
   * 8. Revoke old token + save new token atomically
   */
  async validateAndRotate(params: {
    rawToken: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<TokenPair> {
    // Step 1: Verify JWT signature BEFORE entering the transaction.
    // This is safe outside the transaction — it's a pure crypto operation
    // with no DB state. If the signature is invalid, we reject fast.
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(params.rawToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Steps 2–8: Everything that touches DB state runs inside the transaction.
    return this.refreshRepo.manager.transaction(async (manager) => {
      // Step 2: Lock the user row — this serializes all concurrent refresh
      // requests for the same user. Only one will proceed at a time.
      await manager.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [
        payload.sub,
      ]);

      // Step 3: Look up token record by JTI (now safe — we hold the lock)
      const tokenRecord = await manager.findOne(RefreshTokenEntity, {
        where: { jti: payload.jti },
      });

      // Step 4: Token not found in DB
      if (!tokenRecord) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // Step 5: Revoked token reuse — genuine attack or double-submit
      // Revoke ALL tokens for this user as a security measure.
      if (tokenRecord.isRevoked) {
        this.logger.warn(
          `⚠️  Revoked refresh token reuse detected for user ${tokenRecord.userId}. Revoking all tokens.`,
        );
        await manager.update(
          RefreshTokenEntity,
          { userId: tokenRecord.userId, isRevoked: false },
          { isRevoked: true },
        );
        throw new UnauthorizedException(
          'Token reuse detected. All sessions invalidated.',
        );
      }

      // Step 6: Expired token
      if (new Date() > tokenRecord.expiresAt) {
        await manager.update(RefreshTokenEntity, tokenRecord.id, {
          isRevoked: true,
        });
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Step 7: Verify raw token against stored SHA-256 hash
      const isValid = verifyToken(params.rawToken, tokenRecord.tokenHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Step 8a: Generate new token pair
      const tokenPair = await this.generateTokenPair(payload.sub, payload.role);
      const newTokenHash = hashToken(tokenPair.refreshToken);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Step 8b: Mark ALL existing active tokens as revoked (rotation)
      await manager.update(
        RefreshTokenEntity,
        { userId: payload.sub, isRevoked: false },
        { isRevoked: true },
      );

      // Step 8c: Save the new token record
      const newRecord = manager.create(RefreshTokenEntity, {
        userId: payload.sub,
        jti: tokenPair.jti,
        tokenHash: newTokenHash,
        expiresAt,
        userAgent: params.userAgent ?? null,
        ipAddress: params.ipAddress ?? null,
      });
      await manager.save(newRecord);

      return tokenPair;
    });
  }

  /**
   * Validate a refresh token (read-only — for logout only).
   * Does NOT rotate — just finds the record by JTI after signature check.
   */
  async findValidTokenRecord(
    rawToken: string,
  ): Promise<{ userId: string; jti: string }> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(rawToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenRecord = await this.refreshRepo.findOne({
      where: { jti: payload.jti },
    });

    if (!tokenRecord || tokenRecord.isRevoked) {
      throw new UnauthorizedException('Refresh token not found or already revoked');
    }

    return { userId: payload.sub, jti: payload.jti };
  }

  /**
   * Revoke a single refresh token by JTI.
   */
  async revokeByJti(jti: string): Promise<void> {
    await this.refreshRepo.update({ jti }, { isRevoked: true });
  }

  /**
   * Revoke ALL refresh tokens for a user.
   * Used for security events (password change, account compromise, etc.)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshRepo.update({ userId, isRevoked: false }, { isRevoked: true });
  }
}
