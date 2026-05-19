import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { User } from '../../entities/user.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { OtpPurpose } from '../../entities/otp-code.entity';
import { UserService } from '../user/user.service';
import { UsersRepository } from '../user/repositories/users.repository';
import { OtpService } from '../otp/otp.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { MailService } from '../mail/mail.service';

import { hashPassword, verifyPassword } from '../../shared/helpers';
import { ProfileService } from '../profile/profile.service';

import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
    private readonly profileService: ProfileService,
    private readonly usersRepository: UsersRepository,
  ) {}

  // ── REGISTER ────────────────────────────────────────────────────────

  /**
   * Register a new user.
   *
   * Flow:
   * 1. Validate uniqueness of email + username
   * 2. Hash password with bcrypt (never store raw)
   * 3. Create inactive user
   * 4. Generate OTP, hash it, save to otp_codes
   * 5. Send OTP via email
   * 6. Return success message only (no tokens, no user data)
   */
  async register(dto: RegisterDto): Promise<{ message: string }> {
    this.logger.debug(`Register process initiated for email: ${dto.email}, username: ${dto.username}`);

    // 1. Check uniqueness
    await this.userService.assertUnique(dto.email, dto.username);

    // 2. Hash password
    const passwordHash = await hashPassword(dto.password);

    // 3. Create inactive user
    const user = await this.userService.createInactiveUser({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });
    this.logger.debug(`Inactive user created successfully`, { userId: user.id });

    // 4. Generate + save OTP
    const rawOtp = await this.otpService.createOtp(dto.email, OtpPurpose.REGISTER);
    this.logger.debug(`OTP generated successfully for email: ${dto.email}`);

    // 5. Send OTP email
    await this.mailService.sendVerificationOtp(dto.email, rawOtp);
    this.logger.debug(`Verification email with OTP sent successfully to: ${dto.email}`);

    return {
      message: 'Registration successful. Please check your email for the verification code.',
    };
  }

  // ── VERIFY EMAIL ────────────────────────────────────────────────────

  /**
   * Verify user email with OTP.
   *
   * Uses a database transaction to ensure atomicity:
   * - Activate user + create profile in one transaction
   * - If either fails, both are rolled back
   */
  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    this.logger.debug(`Verify email request initiated for: ${dto.email}`);

    // Verify OTP (handles expiry, attempts, brute-force protection)
    await this.otpService.verifyAndConsumeOtp(dto.email, dto.code, OtpPurpose.REGISTER);
    this.logger.debug(`OTP successfully verified and consumed for: ${dto.email}`);

    // Use transaction for atomicity: activate user + create profile
    await this.dataSource.transaction(async (manager) => {
      // Activate user
      const user = await manager.findOne(User, {
        where: { email: dto.email },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isActive) {
        throw new BadRequestException('Email is already verified');
      }

      user.isActive = true;
      user.emailVerifiedAt = new Date();
      const activatedUser = await manager.save(user);
      this.logger.debug(`User activated successfully in transaction`, { userId: activatedUser.id });

      // Automatically create profile with display_name = username
      const profile = manager.create(ProfileEntity, {
        userId: user.id,
        displayName: user.username,
      });
      const createdProfile = await manager.save(profile);
      this.logger.debug(`Profile created successfully in transaction`, { profileId: createdProfile.id });
    });

    this.logger.debug(`Email verification transaction completed successfully for: ${dto.email}`);

    return {
      message: 'Email verified successfully. You can now log in.',
    };
  }

  // ── LOGIN ───────────────────────────────────────────────────────────

  /**
   * Authenticate user with email + password.
   *
   * Security decisions:
   * - Rejects inactive (unverified) users
   * - Uses constant-time password comparison (bcrypt.compare)
   * - Generates separate access + refresh tokens
   * - Stores ONLY hashed refresh token in DB
   * - Records user_agent and ip_address for audit trail
   */
  async login(
    dto: LoginDto,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; username: string; role: string; profile?: any };
    needsOnboarding: boolean;
  }> {
    this.logger.debug(`Login attempt for email: ${dto.email}`);

    const user = await this.userService.findByEmail(dto.email);

    // Generic error message to prevent user enumeration
    if (!user) {
      this.logger.debug(`Login failed: User not found for email ${dto.email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      this.logger.debug(`Login failed: Account is not activated for email ${dto.email}`);
      throw new UnauthorizedException('Account is not activated. Please verify your email first.');
    }

    // Constant-time password comparison via bcrypt
    const isPasswordValid = await verifyPassword(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      this.logger.debug(`Login failed: Invalid password for email ${dto.email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate token pair
    const tokenPair = await this.refreshTokenService.generateTokenPair(user.id, user.role);
    this.logger.debug(`Token pair generated for user ID: ${user.id}`);

    // Save hashed refresh token to DB
    await this.refreshTokenService.saveRefreshToken({
      userId: user.id,
      jti: tokenPair.jti,
      rawToken: tokenPair.refreshToken,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });
    this.logger.debug(`Refresh token saved to database`, { jti: tokenPair.jti });

    // Update last login timestamp
    await this.userService.updateLastLogin(user.id);
    this.logger.debug(`Last login timestamp updated for user ID: ${user.id}`);

    const onboardingStatus = await this.profileService.getOnboardingStatus(user.id);
    this.logger.debug(`Onboarding status retrieved`, {
      userId: user.id,
      needsOnboarding: onboardingStatus.needsOnboarding,
      completion: onboardingStatus.profileCompletion,
    });

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: onboardingStatus.profile,
      },
      needsOnboarding: onboardingStatus.needsOnboarding,
    };
  }

  // ── REFRESH TOKEN ───────────────────────────────────────────────────

  /**
   * Refresh the access token using the refresh token from the cookie.
   *
   * Implements OWASP-recommended refresh token rotation:
   * 1. Validate the existing refresh token
   * 2. Revoke it
   * 3. Issue a brand new token pair
   * 4. Save the new hashed refresh token
   */
  async refreshTokens(
    rawRefreshToken: string,
    meta: { userAgent?: string; ipAddress?: string },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    this.logger.debug(`Refresh tokens request received`);

    // Atomically validates the old token and issues a new pair in one transaction.
    // This eliminates the race condition window that existed when validate and
    // rotate were two separate operations.
    const tokenPair = await this.refreshTokenService.validateAndRotate({
      rawToken: rawRefreshToken,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    this.logger.debug(`Tokens refreshed successfully, new pair rotated`);

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  // ── LOGOUT ──────────────────────────────────────────────────────────

  /**
   * Logout by revoking the refresh token.
   * The access token remains valid until it naturally expires (15m max).
   */
  async logout(rawRefreshToken: string): Promise<{ message: string }> {
    this.logger.debug(`Logout process initiated`);
    try {
      const { jti } = await this.refreshTokenService.findValidTokenRecord(rawRefreshToken);
      await this.refreshTokenService.revokeByJti(jti);
      this.logger.debug(`Refresh token successfully revoked for logout`, { jti });
    } catch (e) {
      // Silently handle invalid tokens during logout
      // The user is logging out regardless — don't error
      this.logger.debug('Logout called with invalid/expired refresh token or error occurred: ' + (e as any).message);
    }

    return { message: 'Logged out successfully' };
  }

  // ── GET ME ──────────────────────────────────────────────────────────

  /**
   * Get authenticated user's session bootstrap data.
   */
  async getUserProfile(userId: string) {
    this.logger.debug(`Fetching user profile details for user ID: ${userId}`);
    const user = await this.usersRepository.findActiveUserById(userId);

    if (!user) {
      this.logger.debug(`User not found or inactive for user ID: ${userId}`);
      throw new UnauthorizedException('User not found');
    }

    if (user.deletedAt !== null) {
      this.logger.debug(`User account has been deleted for user ID: ${userId}`);
      throw new UnauthorizedException('Account has been deleted');
    }

    if (!user.isActive) {
      this.logger.debug(`User account is not active for user ID: ${userId}`);
      throw new UnauthorizedException('Account is not active');
    }

    const onboardingStatus = await this.profileService.getOnboardingStatus(userId);
    this.logger.debug(`User profile session bootstrap loaded successfully`, {
      userId,
      needsOnboarding: onboardingStatus.needsOnboarding,
    });

    return {
      authenticated: true,
      needsOnboarding: onboardingStatus.needsOnboarding,
      profileCompletion: onboardingStatus.profileCompletion,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: onboardingStatus.profile,
      },
    };
  }
}
