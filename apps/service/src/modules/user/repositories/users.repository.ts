import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findActiveUserById(userId: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id: userId },
      withDeleted: true, // We fetch soft deleted users to explicitly reject them
    });
  }

  // Other user repository methods can go here
}
