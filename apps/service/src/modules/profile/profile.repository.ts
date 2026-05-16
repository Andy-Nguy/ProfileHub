import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { EducationEntity } from '../../entities/education.entity';
import { ExperienceEntity } from '../../entities/experience.entity';
import { ProfileEntity, VisibilityType } from '../../entities/profile.entity';
import { SkillCategory, SkillEntity } from '../../entities/skill.entity';
import { SocialLinkEntity } from '../../entities/social-link.entity';
import {
  SyncEducationDto,
  SyncExperienceDto,
  SyncSkillDto,
  SyncSocialLinkDto,
  UpdateOnboardingDto,
  UpdateProfileDto,
} from './dto';

interface DiscoveryQueryParams {
  page: number;
  limit: number;
  search?: string;
}

interface DiscoveryQueryResult {
  profiles: ProfileEntity[];
  total: number;
}

@Injectable()
export class ProfileRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async getFullProfileAggregateByUserId(
    userId: string,
    manager?: EntityManager,
  ): Promise<ProfileEntity | null> {
    return this.buildAggregateQuery(manager)
      .where('profile.user_id = :userId', { userId })
      .getOne();
  }

  async getPublicProfileAggregateByUsername(username: string): Promise<ProfileEntity | null> {
    return this.buildAggregateQuery()
      .where('profile.visibility = :visibility', { visibility: VisibilityType.PUBLIC })
      .andWhere('account.username = :username', { username })
      .andWhere('account.is_active = :isActive', { isActive: true })
      .andWhere('account.deleted_at IS NULL')
      .getOne();
  }

  async getDiscoveryFeed(params: DiscoveryQueryParams): Promise<DiscoveryQueryResult> {
    const baseQuery = this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'account')
      .where('profile.visibility = :visibility', { visibility: VisibilityType.PUBLIC })
      .andWhere('account.is_active = :isActive', { isActive: true })
      .andWhere('account.deleted_at IS NULL');

    if (params.search) {
      baseQuery.andWhere(
        `
          (
            profile.display_name ILIKE :search
            OR profile.headline ILIKE :search
            OR profile.location ILIKE :search
            OR profile.industry ILIKE :search
            OR account.username ILIKE :search
          )
        `,
        { search: `%${params.search}%` },
      );
    }

    baseQuery
      .orderBy('profile.updated_at', 'DESC')
      .addOrderBy('profile.created_at', 'DESC')
      .skip((params.page - 1) * params.limit)
      .take(params.limit);

    const [profiles, total] = await baseQuery.getManyAndCount();
    if (profiles.length === 0) {
      return { profiles, total };
    }

    const profileIds = profiles.map((profile) => profile.id);
    const skills = await this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.profile_id IN (:...profileIds)', { profileIds })
      .orderBy('skill.display_order', 'ASC')
      .addOrderBy('skill.created_at', 'DESC')
      .getMany();

    const skillsByProfileId = this.groupByProfileId(skills);
    for (const profile of profiles) {
      profile.skills = skillsByProfileId.get(profile.id) ?? [];
    }

    return { profiles, total };
  }

  async updateOnboardingProfileByUserId(
    userId: string,
    dto: UpdateOnboardingDto,
  ): Promise<ProfileEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const profile = await this.getFullProfileAggregateByUserId(userId, manager);
      if (!profile) {
        return null;
      }

      this.applyOnboardingPatch(profile, dto);
      await this.getRepository(ProfileEntity, manager).save(profile);

      return this.getFullProfileAggregateByUserId(userId, manager);
    });
  }

  async syncOwnedProfileAggregate(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const aggregate = await this.getFullProfileAggregateByUserId(userId, manager);
      if (!aggregate) {
        return null;
      }

      this.applyProfilePatch(aggregate, dto);
      await this.getRepository(ProfileEntity, manager).save(aggregate);

      if (dto.experiences !== undefined) {
        await this.syncExperiences(manager, aggregate.id, aggregate.experiences ?? [], dto.experiences);
      }

      if (dto.educations !== undefined) {
        await this.syncEducations(manager, aggregate.id, aggregate.educations ?? [], dto.educations);
      }

      if (dto.skills !== undefined) {
        await this.syncSkills(manager, aggregate.id, aggregate.skills ?? [], dto.skills);
      }

      if (dto.socialLinks !== undefined) {
        await this.syncSocialLinks(manager, aggregate.id, aggregate.socialLinks ?? [], dto.socialLinks);
      }

      return this.getFullProfileAggregateByUserId(userId, manager);
    });
  }

  private buildAggregateQuery(manager?: EntityManager) {
    const repository = this.getRepository(ProfileEntity, manager);

    return repository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'account')
      .leftJoinAndSelect('profile.experiences', 'experience')
      .leftJoinAndSelect('profile.educations', 'education')
      .leftJoinAndSelect('profile.skills', 'skill')
      .leftJoinAndSelect('profile.socialLinks', 'socialLink')
      .orderBy('experience.display_order', 'ASC')
      .addOrderBy('experience.created_at', 'DESC')
      .addOrderBy('education.display_order', 'ASC')
      .addOrderBy('education.created_at', 'DESC')
      .addOrderBy('skill.display_order', 'ASC')
      .addOrderBy('skill.created_at', 'DESC')
      .addOrderBy('socialLink.platform', 'ASC');
  }

  private applyOnboardingPatch(profile: ProfileEntity, dto: UpdateOnboardingDto): void {
    if (dto.displayName !== undefined) {
      profile.displayName = dto.displayName;
    }

    if (dto.headline !== undefined) {
      profile.headline = dto.headline;
    }

    if (dto.avatarUrl !== undefined) {
      profile.avatarUrl = dto.avatarUrl;
    }

    if (dto.visibility !== undefined) {
      profile.visibility = dto.visibility;
    }
  }

  private applyProfilePatch(profile: ProfileEntity, dto: UpdateProfileDto): void {
    this.applyOnboardingPatch(profile, dto);

    if (dto.bio !== undefined) {
      profile.bio = dto.bio;
    }

    if (dto.coverUrl !== undefined) {
      profile.coverUrl = dto.coverUrl;
    }

    if (dto.location !== undefined) {
      profile.location = dto.location;
    }

    if (dto.industry !== undefined) {
      profile.industry = dto.industry;
    }
  }

  private async syncExperiences(
    manager: EntityManager,
    profileId: string,
    existingItems: ExperienceEntity[],
    incomingItems: SyncExperienceDto[],
  ): Promise<void> {
    const repository = this.getRepository(ExperienceEntity, manager);
    const existingById = new Map(existingItems.map((item) => [item.id, item]));
    const retainedIds = new Set(incomingItems.filter((item) => item.id).map((item) => item.id!));
    const upsertItems: ExperienceEntity[] = [];

    for (const item of incomingItems) {
      const entity = item.id ? existingById.get(item.id) : undefined;
      const target = entity ?? repository.create({ profileId });

      target.profileId = profileId;
      target.title = item.title;
      target.company = item.company;
      target.location = item.location ?? null;
      target.employmentType = item.employmentType ?? target.employmentType;
      target.startDate = new Date(item.startDate);
      target.endDate = item.endDate ? new Date(item.endDate) : null;
      target.isCurrent = item.isCurrent ?? false;
      target.description = item.description ?? null;
      target.displayOrder = item.displayOrder ?? 0;

      upsertItems.push(target);
    }

    const deleteIds = existingItems
      .filter((item) => !retainedIds.has(item.id))
      .map((item) => item.id);

    if (upsertItems.length > 0) {
      await repository.save(upsertItems);
    }

    if (deleteIds.length > 0) {
      await repository.delete({ id: In(deleteIds) });
    }
  }

  private async syncEducations(
    manager: EntityManager,
    profileId: string,
    existingItems: EducationEntity[],
    incomingItems: SyncEducationDto[],
  ): Promise<void> {
    const repository = this.getRepository(EducationEntity, manager);
    const existingById = new Map(existingItems.map((item) => [item.id, item]));
    const retainedIds = new Set(incomingItems.filter((item) => item.id).map((item) => item.id!));
    const upsertItems: EducationEntity[] = [];

    for (const item of incomingItems) {
      const entity = item.id ? existingById.get(item.id) : undefined;
      const target = entity ?? repository.create({ profileId });

      target.profileId = profileId;
      target.institution = item.institution;
      target.degree = item.degree ?? null;
      target.fieldOfStudy = item.fieldOfStudy ?? null;
      target.startDate = new Date(item.startDate);
      target.endDate = item.endDate ? new Date(item.endDate) : null;
      target.isCurrent = item.isCurrent ?? false;
      target.description = item.description ?? null;
      target.displayOrder = item.displayOrder ?? 0;

      upsertItems.push(target);
    }

    const deleteIds = existingItems
      .filter((item) => !retainedIds.has(item.id))
      .map((item) => item.id);

    if (upsertItems.length > 0) {
      await repository.save(upsertItems);
    }

    if (deleteIds.length > 0) {
      await repository.delete({ id: In(deleteIds) });
    }
  }

  private async syncSkills(
    manager: EntityManager,
    profileId: string,
    existingItems: SkillEntity[],
    incomingItems: SyncSkillDto[],
  ): Promise<void> {
    const repository = this.getRepository(SkillEntity, manager);
    const existingById = new Map(existingItems.map((item) => [item.id, item]));
    const retainedIds = new Set(incomingItems.filter((item) => item.id).map((item) => item.id!));
    const upsertItems: SkillEntity[] = [];

    for (const item of incomingItems) {
      const entity = item.id ? existingById.get(item.id) : undefined;
      const target = entity ?? repository.create({ profileId });

      target.profileId = profileId;
      target.name = item.name;
      target.category = item.category ?? SkillCategory.OTHER;
      target.displayOrder = item.displayOrder ?? 0;

      upsertItems.push(target);
    }

    const deleteIds = existingItems
      .filter((item) => !retainedIds.has(item.id))
      .map((item) => item.id);

    if (upsertItems.length > 0) {
      await repository.save(upsertItems);
    }

    if (deleteIds.length > 0) {
      await repository.delete({ id: In(deleteIds) });
    }
  }

  private async syncSocialLinks(
    manager: EntityManager,
    profileId: string,
    existingItems: SocialLinkEntity[],
    incomingItems: SyncSocialLinkDto[],
  ): Promise<void> {
    const repository = this.getRepository(SocialLinkEntity, manager);
    const existingById = new Map(existingItems.map((item) => [item.id, item]));
    const retainedIds = new Set(incomingItems.filter((item) => item.id).map((item) => item.id!));
    const upsertItems: SocialLinkEntity[] = [];

    for (const item of incomingItems) {
      const entity = item.id ? existingById.get(item.id) : undefined;
      const target = entity ?? repository.create({ profileId });

      target.profileId = profileId;
      target.platform = item.platform;
      target.url = item.url;

      upsertItems.push(target);
    }

    const deleteIds = existingItems
      .filter((item) => !retainedIds.has(item.id))
      .map((item) => item.id);

    if (upsertItems.length > 0) {
      await repository.save(upsertItems);
    }

    if (deleteIds.length > 0) {
      await repository.delete({ id: In(deleteIds) });
    }
  }

  private getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
    manager?: EntityManager,
  ): Repository<T> {
    return manager
      ? manager.getRepository(entity)
      : this.dataSource.getRepository(entity);
  }

  private groupByProfileId<T extends { profileId: string }>(items: T[]): Map<string, T[]> {
    const grouped = new Map<string, T[]>();

    for (const item of items) {
      const current = grouped.get(item.profileId) ?? [];
      current.push(item);
      grouped.set(item.profileId, current);
    }

    return grouped;
  }
}
