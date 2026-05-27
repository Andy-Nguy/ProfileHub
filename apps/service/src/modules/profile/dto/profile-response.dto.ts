import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisibilityTypeEnum } from '../../../entities';

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

  @ApiProperty({ enum: VisibilityTypeEnum })
  visibility!: VisibilityTypeEnum;

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

  @ApiProperty({ type: 'array', items: { type: 'object', properties: { name: { type: 'string' } } } })
  skills!: { name: string }[];
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

export class EducationResponseDto {
  id!: string;
  profileId!: string;
  institution!: string;
  degree!: string | null;
  fieldOfStudy!: string | null;
  startDate!: string;
  endDate!: string | null;
  isCurrent!: boolean;
  institutionLogoUrl!: string | null;
  description!: string | null;
  displayOrder!: number;
  createdAt!: string;
  updatedAt!: string;
}

export class ExperienceResponseDto {
  id!: string;
  profileId!: string;
  companyId!: string | null;
  title!: string;
  company!: string;
  companyDetails!: CompanyProfileResponseDto | null;
  location!: string | null;
  employmentType!: string;
  startDate!: string;
  endDate!: string | null;
  isCurrent!: boolean;
  description!: string | null;
  displayOrder!: number;
  createdAt!: string;
  updatedAt!: string;
}

export class CompanyProfileResponseDto {
  id!: string;
  name!: string;
  domain!: string | null;
  logoUrl!: string | null;
}

export class SkillResponseDto {
  id!: string;
  profileId!: string;
  name!: string;
  category!: string;
  endorsementCount!: number;
  displayOrder!: number;
  createdAt!: string;
  updatedAt!: string;
}

export class SocialLinkResponseDto {
  id!: string;
  profileId!: string;
  platform!: string;
  url!: string;
  createdAt!: string;
  updatedAt!: string;
}
