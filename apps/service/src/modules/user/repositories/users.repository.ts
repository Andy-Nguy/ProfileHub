import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findActiveUserById(userId: string): Promise<UserEntity | null> {
    return this.repo.findOne({
      where: { id: userId },
      withDeleted: true, // We fetch soft deleted users to explicitly reject them
    });
  }

  // Other user repository methods can go here
}
