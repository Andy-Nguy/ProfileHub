import { ProfileEntity } from '../../../entities/profile.entity';
import {
  DiscoveryFeedResponseDto,
  DiscoveryProfileDto,
  OnboardingStatusResponseDto,
  ProfileResponseDto,
} from '../dto';

export function toOnboardingStatusResponseDto(status: {
  needsOnboarding: boolean;
  profileCompletion: number;
  profile: ProfileEntity | null;
}): OnboardingStatusResponseDto {
  const profile = status.profile;

  return {
    needsOnboarding: status.needsOnboarding,
    profileCompletion: status.profileCompletion,
    profile: profile
      ? {
          id: profile.id,
          displayName: profile.displayName,
          headline: profile.headline,
          avatarUrl: profile.avatarUrl,
          visibility: profile.visibility,
        }
      : null,
  };
}

export function toProfileResponseDto(
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
    experiences: profile.experiences ?? [],
    educations: profile.educations ?? [],
    skills: profile.skills ?? [],
    socialLinks: profile.socialLinks ?? [],
  };
}

export function toDiscoveryProfileDto(
  profile: ProfileEntity,
): DiscoveryProfileDto {
  return {
    id: profile.id,
    username: profile.user?.username ?? '',
    displayName: profile.displayName,
    headline: profile.headline,
    avatarUrl: profile.avatarUrl,
    location: profile.location,
    industry: profile.industry,
    likesCount: 0,
    skills: profile.skills?.map((s) => ({ name: s.name })) ?? [],
  };
}

export function toDiscoveryFeedResponseDto(
  profiles: ProfileEntity[],
  total: number,
  page: number,
  limit: number,
): DiscoveryFeedResponseDto {
  return {
    items: profiles.map(toDiscoveryProfileDto),
    total,
    page,
    limit,
  };
}
