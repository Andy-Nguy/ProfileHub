import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { User } from '../../entities/user.entity';
import { ProfileEntity } from '../../entities/profile.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { MailModule } from '../mail/mail.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ProfileEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}), // secrets provided at sign/verify time
    ConfigModule,
    UserModule,
    OtpModule,
    RefreshTokenModule,
    MailModule,
    ProfileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
