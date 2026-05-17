import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) throw new NotFoundException(`User @${username} not found`);
    return user;
  }

  /**
   * Check if email or username is already taken.
   * Throws ConflictException if so.
   */
  async assertUnique(email: string, username: string): Promise<void> {
    const existingEmail = await this.repo.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    const existingUsername = await this.repo.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }
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
    const user = this.repo.create({
      email: params.email,
      username: params.username,
      passwordHash: params.passwordHash,
      isActive: false,
    });

    return this.repo.save(user);
  }

  /**
   * Activate a user after email verification.
   */
  async activateUser(email: string): Promise<User> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    user.isActive = true;
    user.emailVerifiedAt = new Date();

    return this.repo.save(user);
  }

  /**
   * Update last_login_at timestamp.
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.repo.update(userId, { lastLoginAt: new Date() });
  }
}
