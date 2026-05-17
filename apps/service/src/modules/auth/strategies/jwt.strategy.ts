import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';

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
 * - Uses a SEPARATE secret from the refresh token secret
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  /**
   * Called after JWT signature verification.
   * Validates the user still exists and is active.
   * Returned value is attached to `request.user`.
   */
  async validate(payload: JwtPayload) {
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
