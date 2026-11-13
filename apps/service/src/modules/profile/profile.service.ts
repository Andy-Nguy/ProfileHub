import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import {
  UpdateOnboardingDto,
  UpdateProfileDto,
  ExperienceDto,
  EducationDto,
  SkillDto,
  SocialLinkDto,
  ProfileResponseDto,
  OnboardingStatusResponseDto,
  DiscoveryFeedResponseDto,
  DiscoveryQueryDto,
} from './dto';
import { ProfileRepository } from './profile.repository';
import { ProfileEntity } from '../../entities';
import {
  toProfileResponseDto,
  toOnboardingStatusResponseDto,
  toDiscoveryFeedResponseDto,
} from './mappers';
import { SuccessResponse } from '@profilehub/types';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly profileRepository: ProfileRepository) {}

  private async getRequiredProfileByUserId(
    userId: string,
  ): Promise<ProfileEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
  private calculateCompletion(profile: ProfileEntity | null): {
    completionPercent: number;
    needsOnboarding: boolean;
  } {
    const needsOnboarding = !profile || !profile.headline;
    let completionPercent = 0;
    if (profile) {
      if (profile.displayName) completionPercent += 25;
      if (profile.headline) completionPercent += 25;
      if (profile.bio) completionPercent += 25;
      if (profile.location) completionPercent += 25;
    }
    return { completionPercent, needsOnboarding };
  }

  async getUserFullProfile(userId: string): Promise<ProfileResponseDto> {
    this.logger.debug(`Fetching full profile for user ID: ${userId}`);
    const user = await this.profileRepository.getUserFullProfile(userId);

    if (!user || !user.profile) {
      this.logger.debug(
        `Full profile query returned null for user ID: ${userId}`,
      );
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    const { completionPercent, needsOnboarding } = this.calculateCompletion(
      user.profile,
    );
    return toProfileResponseDto(user.profile, {
      username: user.username,
      completionPercent,
      needsOnboarding,
    });
  }

  async getProfileByProfileId(profileId: string): Promise<ProfileResponseDto> {
    this.logger.debug(`Fetching full profile by profile ID: ${profileId}`);
    const user =
      await this.profileRepository.getFullProfileByProfileId(profileId);

    if (!user || !user.profile) {
      this.logger.debug(
        `Full profile query returned null for profile ID: ${profileId}`,
      );
      throw new NotFoundException(`Profile ${profileId} not found`);
    }

    const { completionPercent, needsOnboarding } = this.calculateCompletion(
      user.profile,
    );
    return toProfileResponseDto(user.profile, {
      username: user.username,
      completionPercent,
      needsOnboarding,
    });
  }

  async getProfileByUsername(username: string): Promise<ProfileResponseDto> {
    this.logger.debug(`Fetching full profile by username: ${username}`);
    const user =
      await this.profileRepository.getFullProfileByUsername(username);

    if (!user || !user.profile) {
      this.logger.debug(
        `Full profile query returned null for username: ${username}`,
      );
      throw new NotFoundException(`Profile for user @${username} not found`);
    }

    const { completionPercent, needsOnboarding } = this.calculateCompletion(
      user.profile,
    );
    return toProfileResponseDto(user.profile, {
      username: user.username,
      completionPercent,
      needsOnboarding,
    });
  }

  async getDiscoveryFeed(
    query: DiscoveryQueryDto,
  ): Promise<DiscoveryFeedResponseDto> {
    const { page = 1, limit = 20 } = query;
    this.logger.debug(`Fetching discovery feed profiles`, { query });
    const [profiles, total] =
      await this.profileRepository.findDiscoveryProfiles(query);
    return toDiscoveryFeedResponseDto(profiles, total, page, limit);
  }

  async getOnboardingStatus(
    userId: string,
  ): Promise<OnboardingStatusResponseDto> {
    this.logger.debug(`Calculating onboarding status for user ID: ${userId}`);
    const profile = await this.profileRepository.findProfileByUserId(userId);
    const { completionPercent, needsOnboarding } =
      this.calculateCompletion(profile);

    this.logger.debug(`Onboarding status details computed`, {
      userId,
      needsOnboarding,
      profileCompletion: completionPercent,
    });

    return toOnboardingStatusResponseDto({
      needsOnboarding,
      profileCompletion: completionPercent,
      profile,
    });
  }

  async updateOnboarding(
    userId: string,
    dto: UpdateOnboardingDto,
  ): Promise<OnboardingStatusResponseDto> {
    this.logger.debug(`Updating onboarding profile for user ID: ${userId}`, {
      dto,
    });
    await this.upsertProfile(userId, dto);
    return this.getOnboardingStatus(userId);
  }

  // ── BASIC PROFILE UPDATE ──────────────────────────────────────────
  async upsertProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    this.logger.debug(`Upserting basic profile fields for user ID: ${userId}`, {
      dto,
    });
    const payload = Object.fromEntries(
      Object.entries({
        displayName: dto.displayName,
        headline: dto.headline,
        bio: dto.bio,
        avatarUrl: dto.avatarUrl,
        coverUrl: dto.coverUrl,
        location: dto.location,
        industry: dto.industry,
        visibility: dto.visibility,
      }).filter(([, value]) => value !== undefined),
    );

    const profile = await this.profileRepository.upsertProfileFields(
      userId,
      payload,
    );
    const { completionPercent, needsOnboarding } =
      this.calculateCompletion(profile);
    this.logger.debug(
      `Basic profile fields upserted successfully for user ID: ${userId}`,
      { profileId: profile.id },
    );
    return toProfileResponseDto(profile, {
      completionPercent,
      needsOnboarding,
    });
  }

  // ── CV SECTION CRUD: SKILL ────────────────────────────────────────

  async createSkill(userId: string, dto: SkillDto): Promise<SuccessResponse> {
    this.logger.debug(`Creating new skill for user ID: ${userId}`, { dto });
    const profile = await this.getRequiredProfileByUserId(userId);
    if (
      await this.profileRepository.existsSkillByNormalizedName(
        profile.id,
        dto.name,
      )
    ) {
      throw new ConflictException('Skill already exists');
    }
    await this.profileRepository.createSkill(profile.id, dto);
    return { success: true };
  }

  async updateSkill(
    userId: string,
    skillId: string,
    dto: SkillDto,
  ): Promise<SuccessResponse> {
    this.logger.debug(`Updating skill ID: ${skillId} for user ID: ${userId}`, {
      dto,
    });
    const profile = await this.getRequiredProfileByUserId(userId);
    const skill = await this.profileRepository.updateSkill(
      profile.id,
      skillId,
      dto,
    );
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return { success: true };
  }

  async deleteSkill(userId: string, skillId: string): Promise<void> {
    this.logger.debug(`Deleting skill ID: ${skillId} for user ID: ${userId}`);
    const profile = await this.getRequiredProfileByUserId(userId);
    const deleted = await this.profileRepository.deleteSkill(
      profile.id,
      skillId,
    );
    if (!deleted) {
      throw new NotFoundException('Skill not found');
    }
  }

  // ── CV SECTION CRUD: EXPERIENCE ───────────────────────────────────

  async createExperience(
    userId: string,
    dto: ExperienceDto,
  ): Promise<SuccessResponse> {
    this.logger.debug(`Creating new experience for user ID: ${userId}`, {
      dto,
    });
    const profile = await this.getRequiredProfileByUserId(userId);
    await this.profileRepository.createExperience(profile.id, dto);
    return { success: true };
  }

  async updateExperience(
    userId: string,
    expId: string,
    dto: ExperienceDto,
  ): Promise<SuccessResponse> {
    this.logger.debug(
      `Updating experience ID: ${expId} for user ID: ${userId}`,
      { dto },
    );
    const profile = await this.getRequiredProfileByUserId(userId);
    const exp = await this.profileRepository.updateExperience(
      profile.id,
      expId,
      dto,
    );
    if (!exp) {
      throw new NotFoundException('Experience not found');
    }
    return { success: true };
  }

  async deleteExperience(userId: string, expId: string): Promise<void> {
    this.logger.debug(
      `Deleting experience ID: ${expId} for user ID: ${userId}`,
    );
    const profile = await this.getRequiredProfileByUserId(userId);
    const deleted = await this.profileRepository.deleteExperience(
      profile.id,
      expId,
    );
    if (!deleted) {
      throw new NotFoundException('Experience not found');
    }
  }

  // ── CV SECTION CRUD: EDUCATION ────────────────────────────────────

  async createEducation(
    userId: string,
    dto: EducationDto,
  ): Promise<SuccessResponse> {
    this.logger.debug(`Creating new education for user ID: ${userId}`, { dto });
    const profile = await this.getRequiredProfileByUserId(userId);
    await this.profileRepository.createEducation(profile.id, dto);
    return { success: true };
  }

  async updateEducation(
    userId: string,
    eduId: string,
    dto: EducationDto,
  ): Promise<SuccessResponse> {
    this.logger.debug(
      `Updating education ID: ${eduId} for user ID: ${userId}`,
      { dto },
    );
    const profile = await this.getRequiredProfileByUserId(userId);
    const edu = await this.profileRepository.updateEducation(
      profile.id,
      eduId,
      dto,
    );
    if (!edu) {
      throw new NotFoundException('Education not found');
    }
    return { success: true };
  }

  async deleteEducation(userId: string, eduId: string): Promise<void> {
    this.logger.debug(`Deleting education ID: ${eduId} for user ID: ${userId}`);
    const profile = await this.getRequiredProfileByUserId(userId);
    const deleted = await this.profileRepository.deleteEducation(
      profile.id,
      eduId,
    );
    if (!deleted) {
      throw new NotFoundException('Education not found');
    }
  }

  // ── CV SECTION CRUD: SOCIAL LINK ──────────────────────────────────

  async createSocialLink(
    userId: string,
    dto: SocialLinkDto,
  ): Promise<SuccessResponse> {
    this.logger.debug(`Creating new social link for user ID: ${userId}`, {
      dto,
    });
    const profile = await this.getRequiredProfileByUserId(userId);
    if (
      await this.profileRepository.existsSocialLinkByPlatform(
        profile.id,
        dto.platform,
      )
    ) {
      throw new ConflictException(
        'Social link for this platform already exists',
      );
    }
    await this.profileRepository.createSocialLink(profile.id, dto);
    return { success: true };
  }

  async updateSocialLink(
    userId: string,
    linkId: string,
    dto: SocialLinkDto,
  ): Promise<SuccessResponse> {
    this.logger.debug(
      `Updating social link ID: ${linkId} for user ID: ${userId}`,
      { dto },
    );
    const profile = await this.getRequiredProfileByUserId(userId);
    const sl = await this.profileRepository.updateSocialLink(
      profile.id,
      linkId,
      dto,
    );
    if (!sl) {
      throw new NotFoundException('Social link not found');
    }
    return { success: true };
  }

  async deleteSocialLink(userId: string, linkId: string): Promise<void> {
    this.logger.debug(
      `Deleting social link ID: ${linkId} for user ID: ${userId}`,
    );
    const profile = await this.getRequiredProfileByUserId(userId);
    const deleted = await this.profileRepository.deleteSocialLink(
      profile.id,
      linkId,
    );
    if (!deleted) {
      throw new NotFoundException('Social link not found');
    }
  }
}
