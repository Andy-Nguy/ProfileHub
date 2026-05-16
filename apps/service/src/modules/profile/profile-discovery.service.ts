import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscoveryFeedResponseDto, ProfileResponseDto } from './dto';
import { ProfileRepository } from './profile.repository';
import { ProfileMapper } from './mappers';
import { calculateProfileCompletion } from './profile-completion.util';

@Injectable()
export class ProfileDiscoveryService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly profileMapper: ProfileMapper,
  ) {}

  async getDiscoveryFeed(
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<DiscoveryFeedResponseDto> {
    const result = await this.profileRepository.getDiscoveryFeed({ page, limit, search });

    return this.profileMapper.toDiscoveryFeedResponseDto(
      result.profiles,
      result.total,
      page,
      limit,
    );
  }

  async getPublicProfileByUsername(username: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.getPublicProfileAggregateByUsername(username);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const completionPercent = calculateProfileCompletion(profile);

    return this.profileMapper.toProfileResponseDto(profile, {
      username: profile.user?.username,
      completionPercent,
      needsOnboarding: completionPercent < 100,
      likesCount: 0,
    });
  }
}
