import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Mail service implementation using Nodemailer.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  /**
   * Send a verification OTP email.
   */
  async sendVerificationOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"ProfileHub" <${this.config.get<string>('MAIL_USER')}>`,
      to: email,
      subject: 'ProfileHub — Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Welcome to ProfileHub!</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">Thank you for registering. Please use the following verification code to complete your sign-up process:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a73e8; background-color: #f1f3f4; padding: 10px 20px; border-radius: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 ProfileHub. All rights reserved.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`📧 Verification OTP sent successfully to ${email}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : 'Unknown error';
      this.logger.error(`❌ Failed to send OTP email to ${email}`, errorMessage);
    }

    // Always log to console for backup during development
    this.logger.log(`──────────────────────────────────────────`);
    this.logger.log(`📧 [Backup Log] Verification OTP for ${email}: ${otp}`);
    this.logger.log(`──────────────────────────────────────────`);
  }
}
