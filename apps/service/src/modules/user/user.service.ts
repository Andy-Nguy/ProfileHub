import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    this.logger.debug(`Finding user by ID: ${id}`);
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Finding user by email: ${email}`);
    return this.repo.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    this.logger.debug(`Finding user by username: ${username}`);
    const user = await this.repo.findOne({ where: { username } });
    if (!user) {
      this.logger.debug(`User not found with username: ${username}`);
      throw new NotFoundException(`User @${username} not found`);
    }
    return user;
  }

  /**
   * Check if email or username is already taken.
   * Throws ConflictException if so.
   */
  async assertUnique(email: string, username: string): Promise<void> {
    this.logger.debug(`Checking uniqueness for email: ${email}, username: ${username}`);
    const existingEmail = await this.repo.findOne({ where: { email } });
    if (existingEmail) {
      this.logger.debug(`Uniqueness check failed: Email ${email} already registered`);
      throw new ConflictException('Email is already registered');
    }

    const existingUsername = await this.repo.findOne({ where: { username } });
    if (existingUsername) {
      this.logger.debug(`Uniqueness check failed: Username ${username} already taken`);
      throw new ConflictException('Username is already taken');
    }
    this.logger.debug(`Email and username uniqueness successfully validated`);
  }

  /**
   * Create a new inactive user.
   * Password must be pre-hashed before calling this method.
   */
  async createInactiveUser(params: {
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<User> {
    this.logger.debug(`Creating inactive user for email: ${params.email}`);
    const user = this.repo.create({
      email: params.email,
      username: params.username,
      passwordHash: params.passwordHash,
      isActive: false,
    });

    const savedUser = await this.repo.save(user);
    this.logger.debug(`Successfully created inactive user record`, { userId: savedUser.id });
    return savedUser;
  }

  /**
   * Activate a user after email verification.
   */
  async activateUser(email: string): Promise<User> {
    this.logger.debug(`Activating user account for email: ${email}`);
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      this.logger.debug(`Activation failed: User not found for email: ${email}`);
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    user.emailVerifiedAt = new Date();

    const activatedUser = await this.repo.save(user);
    this.logger.debug(`Successfully activated user account`, { userId: activatedUser.id });
    return activatedUser;
  }

  /**
   * Update last_login_at timestamp.
   */
  async updateLastLogin(userId: string): Promise<void> {
    this.logger.debug(`Updating last login timestamp for user ID: ${userId}`);
    await this.repo.update(userId, { lastLoginAt: new Date() });
    this.logger.debug(`Last login timestamp updated successfully for user ID: ${userId}`);
  }
}
