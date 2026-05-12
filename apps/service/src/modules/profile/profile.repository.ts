import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repo: Repository<ProfileEntity>,
  ) {}

  async findByUserIdWithRelations(userId: string): Promise<ProfileEntity | null> {
    return this.repo.findOne({
      where: { userId },
      relations: ['skills', 'experiences', 'educations'],
    });
  }

  async findById(id: string): Promise<ProfileEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findProfileByUserId(userId: string): Promise<ProfileEntity | null> {
    return this.repo.findOne({
      where: { userId },
    });
  }

  // Other methods can be added here as needed
}
