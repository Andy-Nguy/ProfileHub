import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  VisibilityTypeEnum,
  ProfileResponse,
  OnboardingStatusResponse,
  IDiscoveryProfile,
  DiscoveryFeedResponse,
  SuccessResponse,
  IEducation,
  IExperience,
  ISkill,
  ISocialLink,
} from '@profilehub/types';

export class ProfileResponseDto implements ProfileResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty({ nullable: true })
  headline: string | null;

  @ApiProperty({ nullable: true })
  bio: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ nullable: true })
  coverUrl: string | null;

  @ApiProperty({ nullable: true })
  location: string | null;

  @ApiProperty({ nullable: true })
  industry: string | null;

  @ApiProperty({ enum: VisibilityTypeEnum })
  visibility: VisibilityTypeEnum;

  @ApiProperty()
  completionPercent: number;

  @ApiProperty()
  needsOnboarding: boolean;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  experiences: IExperience[];

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  educations: IEducation[];

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  skills: ISkill[];

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  socialLinks: ISocialLink[];
}

export class OnboardingProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty({ nullable: true })
  headline: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ enum: VisibilityTypeEnum })
  visibility: VisibilityTypeEnum;
}

export class OnboardingStatusResponseDto implements OnboardingStatusResponse {
  @ApiProperty()
  needsOnboarding: boolean;

  @ApiProperty()
  profileCompletion: number;

  @ApiProperty({ type: OnboardingProfileDto, nullable: true })
  profile: OnboardingProfileDto | null;
}

export class DiscoveryProfileDto implements IDiscoveryProfile {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty({ nullable: true })
  headline: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ nullable: true })
  location: string | null;

  @ApiProperty({ nullable: true })
  industry: string | null;

  @ApiProperty()
  likesCount: number;

  @ApiProperty({ type: 'array', items: { type: 'object', properties: { name: { type: 'string' } } } })
  skills: { name: string }[];
}

export class DiscoveryFeedResponseDto implements DiscoveryFeedResponse {
  @ApiProperty({ type: [DiscoveryProfileDto] })
  items: DiscoveryProfileDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class SuccessResponseDto implements SuccessResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

