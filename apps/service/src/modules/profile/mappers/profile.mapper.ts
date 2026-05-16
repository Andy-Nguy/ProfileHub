import { Injectable } from '@nestjs/common';
import { ProfileEntity } from '../../../entities/profile.entity';
import {
  DiscoveryFeedResponseDto,
  DiscoveryProfileDto,
  OnboardingProfileDto,
  OnboardingStatusDto,
  ProfileResponseDto,
} from '../dto';
import { EducationMapper } from './education.mapper';
import { ExperienceMapper } from './experience.mapper';
import { SkillMapper } from './skill.mapper';
import { SocialLinkMapper } from './social-link.mapper';

@Injectable()
export class ProfileMapper {
  constructor(
    private readonly experienceMapper: ExperienceMapper,
    private readonly educationMapper: EducationMapper,
    private readonly skillMapper: SkillMapper,
    private readonly socialLinkMapper: SocialLinkMapper,
  ) {}

  toOnboardingProfileDto(profile: ProfileEntity): OnboardingProfileDto {
    return {
      id: profile.id,
      displayName: profile.displayName,
      headline: profile.headline,
      avatarUrl: profile.avatarUrl,
      visibility: profile.visibility,
    };
  }

  toOnboardingStatusDto(profile: ProfileEntity, profileCompletion: number): OnboardingStatusDto {
    return {
      needsOnboarding: profileCompletion < 100,
      profileCompletion,
      profile: this.toOnboardingProfileDto(profile),
    };
  }

  toProfileResponseDto(
    profile: ProfileEntity,
    options: {
      completionPercent: number;
      needsOnboarding: boolean;
      likesCount?: number;
      username?: string;
    },
  ): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      username: options.username ?? profile.user?.username,
      displayName: profile.displayName,
      headline: profile.headline,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      coverUrl: profile.coverUrl,
      location: profile.location,
      industry: profile.industry,
      visibility: profile.visibility,
      completionPercent: options.completionPercent,
      needsOnboarding: options.needsOnboarding,
      likesCount: options.likesCount ?? 0,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      experiences: (profile.experiences ?? []).map((item) =>
        this.experienceMapper.toResponseDto(item),
      ),
      educations: (profile.educations ?? []).map((item) =>
        this.educationMapper.toResponseDto(item),
      ),
      skills: (profile.skills ?? []).map((item) => this.skillMapper.toResponseDto(item)),
      socialLinks: (profile.socialLinks ?? []).map((item) =>
        this.socialLinkMapper.toResponseDto(item),
      ),
    };
  }

  toDiscoveryFeedResponseDto(
    profiles: ProfileEntity[],
    total: number,
    page: number,
    limit: number,
  ): DiscoveryFeedResponseDto {
    return {
      data: profiles.map((profile) => this.toDiscoveryProfileDto(profile)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private toDiscoveryProfileDto(profile: ProfileEntity): DiscoveryProfileDto {
    return {
      id: profile.id,
      username: profile.user?.username ?? '',
      displayName: profile.displayName,
      headline: profile.headline,
      avatarUrl: profile.avatarUrl,
      location: profile.location,
      industry: profile.industry,
      likesCount: 0,
      skills: (profile.skills ?? []).map((item) => this.skillMapper.toResponseDto(item)),
    };
  }
}
