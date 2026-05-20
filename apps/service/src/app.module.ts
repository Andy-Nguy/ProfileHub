import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { User } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { OtpCodeEntity } from './entities/otp-code.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { SkillEntity } from './entities/skill.entity';
import { ExperienceEntity } from './entities/experience.entity';
import { EducationEntity } from './entities/education.entity';
import { InteractionEntity } from './entities/interaction.entity';
import { SocialLinkEntity } from './entities/social-link.entity';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { StorageModule } from './modules/storage/storage.module';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────────────────
    ConfigModule.forRoot({ isGlobal: true }),

    // ── Rate Limiting ───────────────────────────────────────────────
    // Global rate limit: 100 requests per 60 seconds per IP
    // Individual routes can override this with @Throttle()
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // ── Database ────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASS', 'postgres'),
        database: config.get<string>('DB_NAME', 'profilehub'),
        entities: [
          User,
          ProfileEntity,
          OtpCodeEntity,
          RefreshTokenEntity,
          SkillEntity,
          ExperienceEntity,
          EducationEntity,
          InteractionEntity,
          SocialLinkEntity,
        ],
        // IMPORTANT: Set to false in production and use migrations instead
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    // ── Feature Modules ─────────────────────────────────────────────
    AuthModule,
    UserModule,
    ProfileModule,
    StorageModule,
  ],
  providers: [
    // ── Global Guards ───────────────────────────────────────────────
    // JwtAuthGuard: protects ALL routes by default (use @Public() to opt out)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // RolesGuard: enforces @Roles() decorator on protected routes
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // ThrottlerGuard: enforces rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
