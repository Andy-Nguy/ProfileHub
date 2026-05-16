import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { ProfileMapper } from './mappers';
import {
  SyncEducationDto,
  SyncExperienceDto,
  SyncSkillDto,
  SyncSocialLinkDto,
  UpdateProfileDto,
  ProfileResponseDto,
} from './dto';
import { UsersRepository } from '../user/repositories/users.repository';
import { calculateProfileCompletion } from './profile-completion.util';
import { ProfileEntity } from '../../entities/profile.entity';

@Injectable()
export class ProfileAggregateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly profileMapper: ProfileMapper,
  ) {}

  async getMyProfile(userId: string): Promise<ProfileResponseDto> {
    await this.ensureActiveUser(userId);

    const profile = await this.profileRepository.getFullProfileAggregateByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.toProfileResponse(profile);
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    await this.ensureActiveUser(userId);
    this.validateAggregateUpdate(dto);

    const profile = await this.profileRepository.syncOwnedProfileAggregate(userId, dto);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.toProfileResponse(profile);
  }

  private toProfileResponse(profile: ProfileEntity) {
    const completionPercent = calculateProfileCompletion(profile);

    return this.profileMapper.toProfileResponseDto(profile, {
      username: profile.user?.username,
      completionPercent,
      needsOnboarding: completionPercent < 100,
      likesCount: 0,
    });
  }

  private async ensureActiveUser(userId: string): Promise<void> {
    const user = await this.usersRepository.findActiveUserById(userId);
    if (!user || !user.isActive || user.deletedAt !== null) {
      throw new NotFoundException('User not found');
    }
  }

  private validateAggregateUpdate(dto: UpdateProfileDto): void {
    this.validateExperienceDates(dto.experiences);
    this.validateEducationDates(dto.educations);
    this.validateDuplicateSkillNames(dto.skills);
    this.validateDuplicateSocialPlatforms(dto.socialLinks);
    this.validateDuplicateIds('experiences', dto.experiences?.map((item) => item.id));
    this.validateDuplicateIds('educations', dto.educations?.map((item) => item.id));
    this.validateDuplicateIds('skills', dto.skills?.map((item) => item.id));
    this.validateDuplicateIds('socialLinks', dto.socialLinks?.map((item) => item.id));
  }

  private validateExperienceDates(items?: SyncExperienceDto[]): void {
    if (!items) {
      return;
    }

    for (const item of items) {
      if (item.endDate && item.startDate > item.endDate) {
        throw new BadRequestException('Experience endDate must be after startDate');
      }

      if (item.isCurrent && item.endDate) {
        throw new BadRequestException('Current experience cannot include endDate');
      }
    }
  }

  private validateEducationDates(items?: SyncEducationDto[]): void {
    if (!items) {
      return;
    }

    for (const item of items) {
      if (item.endDate && item.startDate > item.endDate) {
        throw new BadRequestException('Education endDate must be after startDate');
      }
    }
  }

  private validateDuplicateSkillNames(items?: SyncSkillDto[]): void {
    if (!items) {
      return;
    }

    const normalizedNames = new Set<string>();
    for (const item of items) {
      const normalizedName = item.name.trim().toLowerCase();
      if (normalizedNames.has(normalizedName)) {
        throw new BadRequestException('Duplicate skill names are not allowed');
      }

      normalizedNames.add(normalizedName);
    }
  }

  private validateDuplicateSocialPlatforms(items?: SyncSocialLinkDto[]): void {
    if (!items) {
      return;
    }

    const platforms = new Set<string>();
    for (const item of items) {
      if (platforms.has(item.platform)) {
        throw new BadRequestException('Duplicate social link platforms are not allowed');
      }

      platforms.add(item.platform);
    }
  }

  private validateDuplicateIds(section: string, ids?: Array<string | undefined>): void {
    if (!ids) {
      return;
    }

    const seenIds = new Set<string>();
    for (const id of ids) {
      if (!id) {
        continue;
      }

      if (seenIds.has(id)) {
        throw new BadRequestException(`Duplicate ${section} ids are not allowed`);
      }

      seenIds.add(id);
    }
  }
}
