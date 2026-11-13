// profile.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../entities/user.entity';
import { ProfileEntity, VisibilityTypeEnum } from '../../entities/profile.entity';
import { ExperienceEntity } from '../../entities/experience.entity';
import { EducationEntity } from '../../entities/education.entity';
import { SkillEntity } from '../../entities/skill.entity';
import { SocialLinkEntity } from '../../entities/social-link.entity';
import { ExperienceDto, EducationDto, SkillDto, SocialLinkDto, DiscoveryQueryDto } from './dto';

@Injectable()
export class ProfileRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
  ) {}

  // ── Private helper ────────────────────────────────────────────

  private buildFullProfileQuery(): SelectQueryBuilder<User> {
    return this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'p')
      .leftJoinAndSelect('p.socialLinks', 'sl')
      .leftJoinAndSelect('p.experiences', 'exp')
      .leftJoinAndSelect('exp.companyDetails', 'companyDetails')
      .leftJoinAndSelect('p.educations', 'edu')
      .leftJoinAndSelect('p.skills', 'sk')
      .select([
        'u.id',
        'u.email',
        'u.username',
        'u.role',
        'u.isActive',
        'u.emailVerifiedAt',
        'u.lastLoginAt',
        'u.createdAt',
        'p.id',
        'p.userId',
        'p.displayName',
        'p.headline',
        'p.avatarUrl',
        'p.coverUrl',
        'p.bio',
        'p.location',
        'p.industry',
        'p.visibility',
        'p.createdAt',
        'p.updatedAt',
        'sl.id',
        'sl.profileId',
        'sl.platform',
        'sl.url',
        'sl.createdAt',
        'sl.updatedAt',
        'exp.id',
        'exp.profileId',
        'exp.companyId',
        'exp.title',
        'exp.company',
        'exp.location',
        'exp.employmentType',
        'exp.startDate',
        'exp.endDate',
        'exp.isCurrent',
        'exp.description',
        'exp.displayOrder',
        'exp.createdAt',
        'exp.updatedAt',
        'companyDetails.id',
        'companyDetails.name',
        'companyDetails.domain',
        'companyDetails.logoUrl',
        'edu.id',
        'edu.profileId',
        'edu.institution',
        'edu.degree',
        'edu.fieldOfStudy',
        'edu.startDate',
        'edu.endDate',
        'edu.isCurrent',
        'edu.institutionLogoUrl',
        'edu.description',
        'edu.displayOrder',
        'edu.createdAt',
        'edu.updatedAt',
        'sk.id',
        'sk.profileId',
        'sk.name',
        'sk.category',
        'sk.endorsementCount',
        'sk.displayOrder',
        'sk.createdAt',
        'sk.updatedAt',
      ])
      .orderBy('exp.displayOrder', 'ASC')
      .addOrderBy('edu.displayOrder', 'ASC')
      .addOrderBy('sk.displayOrder', 'ASC')
      .where('u.deletedAt IS NULL');
  }

  async getUserFullProfile(userId: string): Promise<User | null> {
    return this.buildFullProfileQuery().andWhere('u.id = :userId', { userId }).getOne();
  }

  async getFullProfileByProfileId(profileId: string): Promise<User | null> {
    return this.buildFullProfileQuery().andWhere('p.id = :profileId', { profileId }).getOne();
  }

  async getFullProfileByUsername(username: string): Promise<User | null> {
    return this.buildFullProfileQuery().andWhere('u.username = :username', { username }).getOne();
  }

  async findDiscoveryProfiles(
    query: DiscoveryQueryDto,
  ): Promise<[ProfileEntity[], number]> {
    const { page = 1, limit = 20, search } = query;
    const qb = this.profileRepo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.user', 'u', 'u.deletedAt IS NULL')
      .leftJoinAndSelect('p.skills', 'sk')
      .select([
        'p.id',
        'p.displayName',
        'p.headline',
        'p.avatarUrl',
        'p.location',
        'p.industry',
        'p.visibility',
        'p.createdAt',
        'u.id',
        'u.username',
        'sk.id',
        'sk.name',
        'sk.displayOrder',
      ])
      .where('p.visibility = :visibility', {
        visibility: VisibilityTypeEnum.PUBLIC,
      });

    if (search) {
      qb.andWhere(
        '(p.displayName ILIKE :search OR p.headline ILIKE :search OR u.username ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return qb
      .orderBy('p.createdAt', 'DESC')
      .addOrderBy('sk.displayOrder', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  // ── Tìm profile theo userId (nhẹ, không join) ─────────────────

  async findProfileByUserId(userId: string): Promise<ProfileEntity | null> {
    return this.profileRepo
      .createQueryBuilder('p')
      .where('p.userId = :userId', { userId })
      .getOne();
  }

  // ── BASIC PROFILE UPDATE ──────────────────────────────────────────

  async upsertProfileFields(
    userId: string,
    payload: Partial<ProfileEntity>,
  ): Promise<ProfileEntity> {
    let profile = await this.findProfileByUserId(userId);

    if (profile) {
      await this.profileRepo.update({ userId }, payload);
    } else {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      const displayName = payload.displayName || user?.username || 'New User';
      profile = this.profileRepo.create({
        userId,
        ...payload,
        displayName,
      });
      await this.profileRepo.save(profile);
    }

    return this.findProfileByUserId(userId) as Promise<ProfileEntity>;
  }

  // ── CV SECTION CRUD: SKILL ────────────────────────────────────────

  async existsSkillByNormalizedName(profileId: string, name: string): Promise<boolean> {
    const count = await this.dataSource
      .getRepository(SkillEntity)
      .createQueryBuilder('s')
      .where('s.profileId = :profileId', { profileId })
      .andWhere('LOWER(s.name) = LOWER(:name)', { name })
      .getCount();
    return count > 0;
  }

  async createSkill(profileId: string, dto: SkillDto): Promise<SkillEntity> {
    const repo = this.dataSource.getRepository(SkillEntity);
    return repo.save(repo.create({ profileId, ...dto }));
  }

  async updateSkill(
    profileId: string,
    skillId: string,
    dto: SkillDto,
  ): Promise<SkillEntity | null> {
    const skillRepo = this.dataSource.getRepository(SkillEntity);
    const result = await skillRepo.update({ id: skillId, profileId }, dto);
    if (result.affected === 0) return null;
    return skillRepo.findOne({ where: { id: skillId, profileId } });
  }

  async deleteSkill(profileId: string, skillId: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(SkillEntity)
      .delete({ id: skillId, profileId });
    return (result.affected ?? 0) > 0;
  }

  // ── CV SECTION CRUD: EXPERIENCE ───────────────────────────────────

  async createExperience(profileId: string, dto: ExperienceDto): Promise<ExperienceEntity> {
    return this.dataSource.transaction(async (manager) => {
      const exp = manager.create(ExperienceEntity, { profileId, ...dto });
      return manager.save(exp);
    });
  }

  async updateExperience(
    profileId: string,
    expId: string,
    dto: ExperienceDto,
  ): Promise<ExperienceEntity | null> {
    const repo = this.dataSource.getRepository(ExperienceEntity);
    const result = await repo.update({ id: expId, profileId }, dto);
    if (result.affected === 0) return null;
    return repo.findOne({ where: { id: expId, profileId } });
  }

  async deleteExperience(profileId: string, expId: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(ExperienceEntity)
      .delete({ id: expId, profileId });
    return (result.affected ?? 0) > 0;
  }

  // ── CV SECTION CRUD: EDUCATION ────────────────────────────────────

  async createEducation(profileId: string, dto: EducationDto): Promise<EducationEntity> {
    return this.dataSource.transaction(async (manager) => {
      const edu = manager.create(EducationEntity, { profileId, ...dto });
      return manager.save(edu);
    });
  }

  async updateEducation(
    profileId: string,
    eduId: string,
    dto: EducationDto,
  ): Promise<EducationEntity | null> {
    const repo = this.dataSource.getRepository(EducationEntity);
    const result = await repo.update({ id: eduId, profileId }, dto);
    if (result.affected === 0) return null;
    return repo.findOne({ where: { id: eduId, profileId } });
  }

  async deleteEducation(profileId: string, eduId: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(EducationEntity)
      .delete({ id: eduId, profileId });
    return (result.affected ?? 0) > 0;
  }

  // ── CV SECTION CRUD: SOCIAL LINK ──────────────────────────────────

  async existsSocialLinkByPlatform(
    profileId: string,
    platform: SocialLinkDto['platform'],
  ): Promise<boolean> {
    const count = await this.dataSource.getRepository(SocialLinkEntity).count({
      where: { profileId, platform },
    });
    return count > 0;
  }

  async createSocialLink(profileId: string, dto: SocialLinkDto): Promise<SocialLinkEntity> {
    const repo = this.dataSource.getRepository(SocialLinkEntity);
    return repo.save(repo.create({ profileId, ...dto }));
  }

  async updateSocialLink(
    profileId: string,
    linkId: string,
    dto: SocialLinkDto,
  ): Promise<SocialLinkEntity | null> {
    const repo = this.dataSource.getRepository(SocialLinkEntity);
    const result = await repo.update({ id: linkId, profileId }, dto);
    if (result.affected === 0) return null;
    return repo.findOne({ where: { id: linkId, profileId } });
  }

  async deleteSocialLink(profileId: string, linkId: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(SocialLinkEntity)
      .delete({ id: linkId, profileId });
    return (result.affected ?? 0) > 0;
  }
}
