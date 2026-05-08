import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import type { CreateUserDto } from '../../../../../libs/shared/data-access/src';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string) {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) throw new NotFoundException(`User @${username} not found`);
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.repo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (exists) throw new ConflictException('Username or email already taken');

    const user = this.repo.create({
      username: dto.username,
      email: dto.email,
      passwordHash: dto.password, // TODO: hash with bcrypt
    });
    return this.repo.save(user);
  }
}
