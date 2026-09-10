import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Maps to the `otp_codes` table.
 * OTPs are always stored as bcrypt hashes — never raw.
 */
export enum OtpPurpose {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
}

@Entity('otp_codes')
export class OtpCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ name: 'code_hash', type: 'varchar', length: 255 })
  codeHash!: string;

  @Column({ type: 'enum', enum: OtpPurpose })
  purpose!: OtpPurpose;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'attempt_count', type: 'int', default: 0 })
  attemptCount!: number;

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed!: boolean;

  @Column({ name: 'resend_count', type: 'int', default: 0 })
  resendCount!: number;

  @Column({ name: 'last_sent_at', type: 'timestamptz', nullable: true })
  lastSentAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
