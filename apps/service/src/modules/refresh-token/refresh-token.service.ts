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
   * - Only the hashed refresh token is stored in DB
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
   * Stores ONLY the bcrypt hash of the token — never the raw value.
   */
  async saveRefreshToken(params: {
    userId: string;
    jti: string;
    rawToken: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void> {
    const tokenHash = await hashToken(params.rawToken);

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
   * Validate a refresh token from the cookie.
   *
   * Security checks:
   * 1. Verify JWT signature with refresh secret
   * 2. Look up token record by JTI
   * 3. Reject if revoked
   * 4. Reject if expired
   * 5. Verify raw token against stored bcrypt hash
   */
  async validateRefreshToken(
    rawToken: string,
  ): Promise<{ userId: string; role: string; tokenRecord: RefreshTokenEntity }> {
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

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (tokenRecord.isRevoked) {
      // Potential token reuse detected — revoke ALL tokens for this user
      // This is a security measure: if a revoked token is reused,
      // it likely means the token was stolen.
      this.logger.warn(
        `⚠️  Revoked refresh token reuse detected for user ${tokenRecord.userId}. Revoking all tokens.`,
      );
      await this.revokeAllUserTokens(tokenRecord.userId);
      throw new UnauthorizedException('Token reuse detected. All sessions invalidated.');
    }

    if (new Date() > tokenRecord.expiresAt) {
      await this.refreshRepo.update(tokenRecord.id, { isRevoked: true });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Verify raw token against stored hash
    const isValid = await verifyToken(rawToken, tokenRecord.tokenHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { userId: payload.sub, role: payload.role, tokenRecord };
  }

  /**
   * Rotate a refresh token: revoke old, issue new.
   * This implements refresh token rotation as recommended by OWASP.
   */
  async rotateRefreshToken(params: {
    oldTokenRecord: RefreshTokenEntity;
    userId: string;
    role: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<TokenPair> {
    // 1. Generate new token pair and hash
    const tokenPair = await this.generateTokenPair(params.userId, params.role);
    const tokenHash = await hashToken(tokenPair.refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 2. Execute atomic database transaction
    await this.refreshRepo.manager.transaction(async (manager) => {
      // Step 1: Lock the user row to prevent concurrent race conditions
      // This forces any concurrent refresh requests for the same user to wait in line.
      await manager.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [params.userId]);

      // Step 2: Mark ALL existing active tokens for this user as revoked
      await manager.update(
        RefreshTokenEntity,
        { userId: params.userId, isRevoked: false },
        { isRevoked: true },
      );

      // Step 3: Create and save the new refresh token
      const record = manager.create(RefreshTokenEntity, {
        userId: params.userId,
        jti: tokenPair.jti,
        tokenHash,
        expiresAt,
        userAgent: params.userAgent ?? null,
        ipAddress: params.ipAddress ?? null,
      });

      await manager.save(record);
    });

    return tokenPair;
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
