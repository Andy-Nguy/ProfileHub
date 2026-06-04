import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UpdateProfileDto, UpsertProfileDto, ExperienceDto, EducationDto, SkillDto, SocialLinkDto } from './dto';
import { ProfileRepository } from './profile.repository';
import { ProfileEntity, ExperienceEntity, EducationEntity, SkillEntity, SocialLinkEntity } from '../../entities';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly profileRepository: ProfileRepository) { }

  async getUserFullProfile(userId: string): Promise<User> {
    this.logger.debug(`Fetching full profile for user ID: ${userId}`);
    const user = await this.profileRepository.getUserFullProfile(userId);

    if (!user) {
      this.logger.debug(`Full profile query returned null for user ID: ${userId}`);
      throw new NotFoundException(`User ${userId} not found`);
    }

    this.logger.debug(`Successfully retrieved full profile for user ID: ${userId}`);
    return user;
  }

  async getProfileByProfileId(profileId: string): Promise<User> {
    this.logger.debug(`Fetching full profile by profile ID: ${profileId}`);
    const user = await this.profileRepository.getFullProfileByProfileId(profileId);

    if (!user) {
      this.logger.debug(`Full profile query returned null for profile ID: ${profileId}`);
      throw new NotFoundException(`Profile ${profileId} not found`);
    }

    this.logger.debug(`Successfully retrieved full profile by profile ID: ${profileId}`);
    return user;
  }

  async getProfileByUsername(username: string): Promise<User> {
    this.logger.debug(`Fetching full profile by username: ${username}`);
    const user = await this.profileRepository.getFullProfileByUsername(username);

    if (!user) {
      this.logger.debug(`Full profile query returned null for username: ${username}`);
      throw new NotFoundException(`Profile for user @${username} not found`);
    }

    this.logger.debug(`Successfully retrieved full profile by username: ${username}`);
    return user;
  }

  async getAllUsersFullProfile(): Promise<User[]> {
    this.logger.debug(`Fetching all users full profiles`);
    const users = await this.profileRepository.getAllUsersFullProfile();
    this.logger.debug(`Successfully fetched ${users.length} full profiles`);
    return users;
  }

  async getOnboardingStatus(userId: string) {
    this.logger.debug(`Calculating onboarding status for user ID: ${userId}`);
    const profile = await this.profileRepository.findProfileByUserId(userId);
    // User needs onboarding if they haven't set a headline yet
    const needsOnboarding = !profile || !profile.headline;

    // Very basic profile completion calculation
    let completion = 0;
    if (profile) {
      if (profile.displayName) completion += 25;
      if (profile.headline) completion += 25;
      if (profile.bio) completion += 25;
      if (profile.location) completion += 25;
    }

    this.logger.debug(`Onboarding status details computed`, {
      userId,
      needsOnboarding,
      profileCompletion: completion,
    });

    return {
      needsOnboarding,
      profileCompletion: completion,
      profile,
    };
  }

  // ── BASIC PROFILE UPDATE ──────────────────────────────────────────
  async upsertProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileEntity> {
    this.logger.debug(`Upserting basic profile fields for user ID: ${userId}`, { dto });
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

    const profile = await this.profileRepository.upsertProfileFields(userId, payload);
    this.logger.debug(`Basic profile fields upserted successfully for user ID: ${userId}`, { profileId: profile.id });
    return profile;
  }

  // ── CV SECTION CRUD: SKILL ────────────────────────────────────────

  async createSkill(userId: string, dto: SkillDto): Promise<SkillEntity> {
    this.logger.debug(`Creating new skill for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Skill creation failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const skill = await this.profileRepository.createSkill(profile.id, dto);
    this.logger.debug(`Skill created successfully`, { skillId: skill.id });
    return skill;
  }

  async updateSkill(userId: string, skillId: string, dto: SkillDto): Promise<SkillEntity> {
    this.logger.debug(`Updating skill ID: ${skillId} for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Skill update failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const skill = await this.profileRepository.updateSkill(profile.id, skillId, dto);
    if (!skill) {
      this.logger.debug(`Skill update failed: Skill ID: ${skillId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Skill not found');
    }
    this.logger.debug(`Skill updated successfully`, { skillId: skill.id });
    return skill;
  }

  async deleteSkill(userId: string, skillId: string): Promise<void> {
    this.logger.debug(`Deleting skill ID: ${skillId} for user ID: ${userId}`);
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Skill deletion failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const deleted = await this.profileRepository.deleteSkill(profile.id, skillId);
    if (!deleted) {
      this.logger.debug(`Skill deletion failed: Skill ID: ${skillId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Skill not found');
    }
    this.logger.debug(`Skill deleted successfully`, { skillId });
  }

  // ── CV SECTION CRUD: EXPERIENCE ───────────────────────────────────

  async createExperience(userId: string, dto: ExperienceDto): Promise<ExperienceEntity> {
    this.logger.debug(`Creating new experience for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Experience creation failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const exp = await this.profileRepository.createExperience(profile.id, dto);
    this.logger.debug(`Experience created successfully`, { expId: exp.id });
    return exp;
  }

  async updateExperience(userId: string, expId: string, dto: ExperienceDto): Promise<ExperienceEntity> {
    this.logger.debug(`Updating experience ID: ${expId} for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Experience update failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const exp = await this.profileRepository.updateExperience(profile.id, expId, dto);
    if (!exp) {
      this.logger.debug(`Experience update failed: Experience ID: ${expId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Experience not found');
    }
    this.logger.debug(`Experience updated successfully`, { expId: exp.id });
    return exp;
  }

  async deleteExperience(userId: string, expId: string): Promise<void> {
    this.logger.debug(`Deleting experience ID: ${expId} for user ID: ${userId}`);
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Experience deletion failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const deleted = await this.profileRepository.deleteExperience(profile.id, expId);
    if (!deleted) {
      this.logger.debug(`Experience deletion failed: Experience ID: ${expId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Experience not found');
    }
    this.logger.debug(`Experience deleted successfully`, { expId });
  }

  // ── CV SECTION CRUD: EDUCATION ────────────────────────────────────

  async createEducation(userId: string, dto: EducationDto): Promise<EducationEntity> {
    this.logger.debug(`Creating new education for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Education creation failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const edu = await this.profileRepository.createEducation(profile.id, dto);
    this.logger.debug(`Education created successfully`, { eduId: edu.id });
    return edu;
  }

  async updateEducation(userId: string, eduId: string, dto: EducationDto): Promise<EducationEntity> {
    this.logger.debug(`Updating education ID: ${eduId} for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Education update failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const edu = await this.profileRepository.updateEducation(profile.id, eduId, dto);
    if (!edu) {
      this.logger.debug(`Education update failed: Education ID: ${eduId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Education not found');
    }
    this.logger.debug(`Education updated successfully`, { eduId: edu.id });
    return edu;
  }

  async deleteEducation(userId: string, eduId: string): Promise<void> {
    this.logger.debug(`Deleting education ID: ${eduId} for user ID: ${userId}`);
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Education deletion failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const deleted = await this.profileRepository.deleteEducation(profile.id, eduId);
    if (!deleted) {
      this.logger.debug(`Education deletion failed: Education ID: ${eduId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Education not found');
    }
    this.logger.debug(`Education deleted successfully`, { eduId });
  }

  // ── CV SECTION CRUD: SOCIAL LINK ──────────────────────────────────

  async createSocialLink(userId: string, dto: SocialLinkDto): Promise<SocialLinkEntity> {
    this.logger.debug(`Creating new social link for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Social link creation failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const sl = await this.profileRepository.createSocialLink(profile.id, dto);
    this.logger.debug(`Social link created successfully`, { linkId: sl.id });
    return sl;
  }

  async updateSocialLink(userId: string, linkId: string, dto: SocialLinkDto): Promise<SocialLinkEntity> {
    this.logger.debug(`Updating social link ID: ${linkId} for user ID: ${userId}`, { dto });
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Social link update failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const sl = await this.profileRepository.updateSocialLink(profile.id, linkId, dto);
    if (!sl) {
      this.logger.debug(`Social link update failed: Social link ID: ${linkId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Social link not found');
    }
    this.logger.debug(`Social link updated successfully`, { linkId: sl.id });
    return sl;
  }

  async deleteSocialLink(userId: string, linkId: string): Promise<void> {
    this.logger.debug(`Deleting social link ID: ${linkId} for user ID: ${userId}`);
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) {
      this.logger.debug(`Social link deletion failed: Profile not found for user ID: ${userId}`);
      throw new NotFoundException('Profile not found');
    }
    const deleted = await this.profileRepository.deleteSocialLink(profile.id, linkId);
    if (!deleted) {
      this.logger.debug(`Social link deletion failed: Social link ID: ${linkId} not found in profile ID: ${profile.id}`);
      throw new NotFoundException('Social link not found');
    }
    this.logger.debug(`Social link deleted successfully`, { linkId });
  }
}