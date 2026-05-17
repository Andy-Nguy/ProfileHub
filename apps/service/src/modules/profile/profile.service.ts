
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UpdateProfileDto, UpsertProfileDto, ExperienceDto, EducationDto, SkillDto, SocialLinkDto } from './dto';
import { ProfileRepository } from './profile.repository';
import { ProfileEntity, ExperienceEntity, EducationEntity, SkillEntity, SocialLinkEntity } from '../../entities';

@Injectable()
export class ProfileService {

  constructor(private readonly profileRepository: ProfileRepository) { }

  async getUserFullProfile(userId: string): Promise<User> {
    const user = await this.profileRepository.getUserFullProfile(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return user;
  }

  async getProfileByProfileId(profileId: string): Promise<User> {
    const user = await this.profileRepository.getFullProfileByProfileId(profileId);

    if (!user) {
      throw new NotFoundException(`Profile ${profileId} not found`);
    }

    return user;
  }

  async getProfileByUsername(username: string): Promise<User> {
    const user = await this.profileRepository.getFullProfileByUsername(username);

    if (!user) {
      throw new NotFoundException(`Profile for user @${username} not found`);
    }

    return user;
  }



  async getAllUsersFullProfile(): Promise<User[]> {
    return this.profileRepository.getAllUsersFullProfile();
  }

  async getOnboardingStatus(userId: string) {
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

    return this.profileRepository.upsertProfileFields(userId, payload);
  }

  // ── CV SECTION CRUD: SKILL ────────────────────────────────────────

  async createSkill(userId: string, dto: SkillDto): Promise<SkillEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return this.profileRepository.createSkill(profile.id, dto);
  }

  async updateSkill(userId: string, skillId: string, dto: SkillDto): Promise<SkillEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const skill = await this.profileRepository.updateSkill(profile.id, skillId, dto);
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async deleteSkill(userId: string, skillId: string): Promise<void> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const deleted = await this.profileRepository.deleteSkill(profile.id, skillId);
    if (!deleted) throw new NotFoundException('Skill not found');
  }

  // ── CV SECTION CRUD: EXPERIENCE ───────────────────────────────────

  async createExperience(userId: string, dto: ExperienceDto): Promise<ExperienceEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return this.profileRepository.createExperience(profile.id, dto);
  }

  async updateExperience(userId: string, expId: string, dto: ExperienceDto): Promise<ExperienceEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const exp = await this.profileRepository.updateExperience(profile.id, expId, dto);
    if (!exp) throw new NotFoundException('Experience not found');
    return exp;
  }

  async deleteExperience(userId: string, expId: string): Promise<void> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const deleted = await this.profileRepository.deleteExperience(profile.id, expId);
    if (!deleted) throw new NotFoundException('Experience not found');
  }

  // ── CV SECTION CRUD: EDUCATION ────────────────────────────────────

  async createEducation(userId: string, dto: EducationDto): Promise<EducationEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return this.profileRepository.createEducation(profile.id, dto);
  }

  async updateEducation(userId: string, eduId: string, dto: EducationDto): Promise<EducationEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const edu = await this.profileRepository.updateEducation(profile.id, eduId, dto);
    if (!edu) throw new NotFoundException('Education not found');
    return edu;
  }

  async deleteEducation(userId: string, eduId: string): Promise<void> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const deleted = await this.profileRepository.deleteEducation(profile.id, eduId);
    if (!deleted) throw new NotFoundException('Education not found');
  }

  // ── CV SECTION CRUD: SOCIAL LINK ──────────────────────────────────

  async createSocialLink(userId: string, dto: SocialLinkDto): Promise<SocialLinkEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    return this.profileRepository.createSocialLink(profile.id, dto);
  }

  async updateSocialLink(userId: string, linkId: string, dto: SocialLinkDto): Promise<SocialLinkEntity> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const sl = await this.profileRepository.updateSocialLink(profile.id, linkId, dto);
    if (!sl) throw new NotFoundException('Social link not found');
    return sl;
  }

  async deleteSocialLink(userId: string, linkId: string): Promise<void> {
    const profile = await this.profileRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');
    const deleted = await this.profileRepository.deleteSocialLink(profile.id, linkId);
    if (!deleted) throw new NotFoundException('Social link not found');
  }
}