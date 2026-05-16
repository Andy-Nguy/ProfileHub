import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisibilityType } from '../../../entities';
import { EducationResponseDto } from './education.dto';
import { ExperienceResponseDto } from './experience.dto';
import { SkillResponseDto } from './skill.dto';
import { SocialLinkResponseDto } from './social-link.dto';

export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ nullable: true })
  headline!: string | null;

  @ApiProperty({ nullable: true })
  bio!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ nullable: true })
  coverUrl!: string | null;

  @ApiProperty({ nullable: true })
  location!: string | null;

  @ApiProperty({ nullable: true })
  industry!: string | null;

  @ApiProperty({ enum: VisibilityType })
  visibility!: VisibilityType;

  @ApiProperty()
  completionPercent!: number;

  @ApiProperty()
  needsOnboarding!: boolean;

  @ApiProperty()
  likesCount!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiProperty({ type: [ExperienceResponseDto] })
  experiences!: ExperienceResponseDto[];

  @ApiProperty({ type: [EducationResponseDto] })
  educations!: EducationResponseDto[];

  @ApiProperty({ type: [SkillResponseDto] })
  skills!: SkillResponseDto[];

  @ApiProperty({ type: [SocialLinkResponseDto] })
  socialLinks!: SocialLinkResponseDto[];
}

export class DiscoveryProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ nullable: true })
  headline!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ nullable: true })
  location!: string | null;

  @ApiProperty({ nullable: true })
  industry!: string | null;

  @ApiProperty()
  likesCount!: number;

  @ApiProperty({ type: [SkillResponseDto] })
  skills!: SkillResponseDto[];
}

export class DiscoveryFeedResponseDto {
  @ApiProperty({ type: [DiscoveryProfileDto] })
  data!: DiscoveryProfileDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  totalPages!: number;
}
