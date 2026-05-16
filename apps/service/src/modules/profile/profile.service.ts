import { Injectable } from '@nestjs/common';
import {
  DiscoveryFeedResponseDto,
  OnboardingStatusDto,
  ProfileResponseDto,
  UpdateOnboardingDto,
  UpdateProfileDto,
} from './dto';
import { ProfileAggregateService } from './profile-aggregate.service';
import { ProfileDiscoveryService } from './profile-discovery.service';
import { ProfileOnboardingService } from './profile-onboarding.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileAggregateService: ProfileAggregateService,
    private readonly profileDiscoveryService: ProfileDiscoveryService,
    private readonly profileOnboardingService: ProfileOnboardingService,
  ) { }

  getDiscoveryFeed(page = 1, limit = 20, search?: string): Promise<DiscoveryFeedResponseDto> {
    return this.profileDiscoveryService.getDiscoveryFeed(page, limit, search);
  }

  findByUsername(username: string): Promise<ProfileResponseDto> {
    return this.profileDiscoveryService.getPublicProfileByUsername(username);
  }

  getMyProfile(userId: string): Promise<ProfileResponseDto> {
    return this.profileAggregateService.getMyProfile(userId);
  }

  updateMyProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    return this.profileAggregateService.updateMyProfile(userId, dto);
  }

  getOnboardingStatus(userId: string): Promise<OnboardingStatusDto> {
    return this.profileOnboardingService.getOnboardingStatus(userId);
  }

  async removeExperience(id: string) {
    const exp = await this.expRepo.findOne({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    return this.expRepo.remove(exp);
  }

  async addEducation(profileId: string, dto: any) {
    const edu = this.eduRepo.create({ ...dto, profileId });
    return this.eduRepo.save(edu);
  }

  async removeEducation(id: string) {
    const edu = await this.eduRepo.findOne({ where: { id } });
    if (!edu) throw new NotFoundException('Education not found');
    return this.eduRepo.remove(edu);
  }

  async addSkill(profileId: string, dto: any) {
    const skill = this.skillRepo.create({ ...dto, profileId });
    return this.skillRepo.save(skill);
  }

  async removeSkill(id: string) {
    const skill = await this.skillRepo.findOne({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return this.skillRepo.remove(skill);
  }

  async getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
    const user = await this.usersRepository.findActiveUserById(userId);
    if (!user || user.deletedAt !== null || !user.isActive) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findByUserIdOrFail(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const profileCompletion = this.calculateProfileCompletion(profile);

    return {
      needsOnboarding: profileCompletion < 70,
      profileCompletion,
      profile: this.toOnboardingProfileDto(profile),
    };
  }

  async updateOnboardingProfile(
    userId: string,
    dto: UpdateOnboardingDto,
  ): Promise<OnboardingStatus> {
    const user = await this.usersRepository.findActiveUserById(userId);
    if (!user || user.deletedAt !== null || !user.isActive) {
      throw new NotFoundException('User not found');
    }

    const existingProfile = await this.profileRepository.findByUserIdOrFail(userId);
    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    const updatedProfile = await this.profileRepository.saveOnboardingProfile(existingProfile, dto);
    const profileCompletion = this.calculateProfileCompletion(updatedProfile);

    return {
      needsOnboarding: profileCompletion < 70,
      profileCompletion,
      profile: this.toOnboardingProfileDto(updatedProfile),
    };
  }

  private calculateProfileCompletion(profile: OnboardingProfileDto): number {
    let completion = 0;

    if (profile.displayName.trim().length > 0) {
      completion += 40;
    }

    if (profile.headline && profile.headline.trim().length > 0) {
      completion += 30;
    }

    if (profile.avatarUrl && profile.avatarUrl.trim().length > 0) {
      completion += 30;
    }

    return completion;
  }

  private toOnboardingProfileDto(profile: {
    id: string;
    displayName: string;
    headline: string | null;
    avatarUrl: string | null;
    visibility: VisibilityType;
  }): OnboardingProfileDto {
    return {
      id: profile.id,
      displayName: profile.displayName,
      headline: profile.headline,
      avatarUrl: profile.avatarUrl,
      visibility: profile.visibility,
    };
  }
}
