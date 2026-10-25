import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { RefreshTokenEntity } from '../../../entities/refresh-token.entity';

/**
 * JWT payload shape embedded in access tokens.
 */
export interface JwtPayload {
  sub: string;   // user ID
  role: string;  // user role
  jti: string;   // JWT ID
}

/**
 * Passport JWT strategy for access token validation.
 *
 * Security decisions:
 * - Extracts JWT from Authorization Bearer header (not cookies)
 * - Validates the user still exists and is active
 * - Validates the access token's JTI exists and is not revoked/expired
 * - Uses a SEPARATE secret from the refresh token secret
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshRepo: Repository<RefreshTokenEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  /**
   * Called after JWT signature verification.
   * Validates the user still exists, is active, and the session is valid.
   * Returned value is attached to `request.user`.
   */
  async validate(payload: JwtPayload) {
    // Validate session (JTI) first - this allows instant revocation
    const session = await this.refreshRepo.findOne({
      where: { jti: payload.jti },
    });

    if (!session || new Date() > session.expiresAt) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    // Rotation revokes the presented refresh row but the access token with the
    // same jti must remain valid until its own expiry. Otherwise a refresh that
    // races login (or React Strict Mode double-mount) immediately 401s /auth/me
    // and the client kicks the user out. Logout / reuse do not set lineage.
    if (session.isRevoked) {
      const rotated =
        session.revokedReason === 'rotated' || !!session.replacedByJti;
      if (!rotated) {
        throw new UnauthorizedException('Session expired or revoked');
      }
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
