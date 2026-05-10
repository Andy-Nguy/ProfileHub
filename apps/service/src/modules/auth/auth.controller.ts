import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto, VerifyEmailDto, LoginDto } from './dto';
import { Public } from './decorators/public.decorator';
import {
  getRefreshCookieOptions,
  getRefreshCookieName,
  getClearRefreshCookieOptions,
} from '../../shared/helpers';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // ── REGISTER ────────────────────────────────────────────────────────

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'Email or username already taken' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ── VERIFY EMAIL ────────────────────────────────────────────────────

  @Public()
  @Post('verify-email')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with OTP code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  // ── LOGIN ───────────────────────────────────────────────────────────

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip ?? req.socket.remoteAddress,
    });

    // Set refresh token in httpOnly cookie
    const nodeEnv = this.config.get<string>('NODE_ENV', 'development');
    res.cookie(
      getRefreshCookieName(),
      result.refreshToken,
      getRefreshCookieOptions(nodeEnv),
    );

    // Return access token in JSON body — NOT the refresh token
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // ── REFRESH ─────────────────────────────────────────────────────────

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies?.[getRefreshCookieName()];

    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refreshTokens(rawRefreshToken, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip ?? req.socket.remoteAddress,
    });

    // Set new refresh token cookie (rotation)
    const nodeEnv = this.config.get<string>('NODE_ENV', 'development');
    res.cookie(
      getRefreshCookieName(),
      result.refreshToken,
      getRefreshCookieOptions(nodeEnv),
    );

    return {
      accessToken: result.accessToken,
    };
  }

  // ── LOGOUT ──────────────────────────────────────────────────────────

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies?.[getRefreshCookieName()];

    const result = await this.authService.logout(rawRefreshToken);

    // Clear the refresh token cookie
    const nodeEnv = this.config.get<string>('NODE_ENV', 'development');
    res.clearCookie(
      getRefreshCookieName(),
      getClearRefreshCookieOptions(nodeEnv),
    );

    return result;
  }
}
