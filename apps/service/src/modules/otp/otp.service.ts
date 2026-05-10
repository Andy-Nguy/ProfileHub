import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { OtpCodeEntity, OtpPurpose } from '../../entities/otp-code.entity';
import { generateOtp, hashOtp, verifyOtp } from '../../shared/helpers';

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectRepository(OtpCodeEntity)
    private readonly otpRepo: Repository<OtpCodeEntity>,
  ) {}

  /**
   * Create a new OTP code for the given email and purpose.
   * Invalidates (marks used) any previous active OTPs for the same email+purpose.
   * Returns the raw OTP (to be sent via email) — never stored raw.
   */
  async createOtp(email: string, purpose: OtpPurpose): Promise<string> {
    // Invalidate any previously active OTPs for this email+purpose
    await this.otpRepo.update(
      { email, purpose, isUsed: false },
      { isUsed: true },
    );

    const rawOtp = generateOtp();
    const codeHash = await hashOtp(rawOtp);
    //TODO: remove the hash OTP code,and check remove OTP when user first type correct OTP CODE when register

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

    const otpRecord = this.otpRepo.create({
      email,
      codeHash,
      purpose,
      expiresAt,
    });

    await this.otpRepo.save(otpRecord);

    this.logger.debug(`OTP created for ${email} [${purpose}]`);
    return rawOtp;
  }

  /**
   * Verify an OTP code against stored hashes.
   *
   * Security checks:
   * 1. Find the latest unused OTP for email+purpose
   * 2. Reject if expired
   * 3. Reject if max attempts exceeded (brute-force protection)
   * 4. Use bcrypt.compare for constant-time comparison
   * 5. Increment attempt_count on failure
   * 6. Mark as used on success
   */
  async verifyAndConsumeOtp(
    email: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const otpRecord = await this.otpRepo.findOne({
      where: { email, purpose, isUsed: false },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('No active OTP found. Please request a new one.');
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      // Mark expired OTP as used to prevent further attempts
      await this.otpRepo.update(otpRecord.id, { isUsed: true });
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Brute-force protection: max 5 attempts
    if (otpRecord.attemptCount >= MAX_OTP_ATTEMPTS) {
      await this.otpRepo.update(otpRecord.id, { isUsed: true });
      throw new BadRequestException(
        'Maximum OTP attempts exceeded. Please request a new one.',
      );
    }

    // Constant-time comparison via bcrypt
    const isValid = await verifyOtp(code, otpRecord.codeHash);

    if (!isValid) {
      // Increment attempt counter
      await this.otpRepo.increment({ id: otpRecord.id }, 'attemptCount', 1);

      const remaining = MAX_OTP_ATTEMPTS - otpRecord.attemptCount - 1;
      throw new BadRequestException(
        `Invalid OTP. ${remaining} attempt(s) remaining.`,
      );
    }

    // Mark OTP as used (consumed)
    await this.otpRepo.update(otpRecord.id, { isUsed: true });
  }
}
