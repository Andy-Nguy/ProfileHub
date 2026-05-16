import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UpdateOnboardingDto } from './dto';

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

  async findByUserIdOrFail(userId: string): Promise<ProfileEntity | null> {
    return this.repo.findOne({
      where: { userId },
    });
  }

  async saveOnboardingProfile(
    profile: ProfileEntity,
    dto: UpdateOnboardingDto,
  ): Promise<ProfileEntity> {
    Object.assign(profile, dto);
    return this.repo.save(profile);
  }

  async findPublicProfileByUsername(username: string): Promise<ProfileEntity | null> {
    return this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.skills', 's')
      .leftJoinAndSelect('p.experiences', 'e')
      .leftJoinAndSelect('p.educations', 'ed')
      .where('u.username = :username', { username })
      .andWhere('u.isActive = :isActive', { isActive: true })
      .andWhere('u.deletedAt IS NULL')
      .getOne();
  }

  async findDiscoverableProfiles(page: number, limit: number, search?: string) {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.skills', 's')
      .where('p.visibility = :vis', { vis: 'public' })
      .andWhere('u.isActive = :isActive', { isActive: true })
      .andWhere('u.deletedAt IS NULL');

    if (search) {
      qb.andWhere(
        '(p.display_name ILIKE :q OR p.headline ILIKE :q OR u.username ILIKE :q)',
        { q: `%${search}%` },
      );
    }

    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return qb.getManyAndCount();
  }
}
