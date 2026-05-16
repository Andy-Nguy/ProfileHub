import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VisibilityType } from '../../../entities';
import { SyncExperienceDto } from './experience.dto';
import { SyncEducationDto } from './education.dto';
import { SyncSkillDto } from './skill.dto';
import { SyncSocialLinkDto } from './social-link.dto';

/**
 * DTO for full profile update (beyond onboarding).
 * Supports upserting sub-resources in bulk.
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({ example: 'Senior Backend Engineer @ Acme Corp', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(220)
  headline?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(2048)
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(2048)
  coverUrl?: string | null;

  @ApiPropertyOptional({ example: 'Building cool things with TypeScript', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  bio?: string | null;

  @ApiPropertyOptional({ example: 'Ho Chi Minh City, Vietnam', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(150)
  location?: string | null;

  @ApiPropertyOptional({ example: 'Software Engineering', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(100)
  industry?: string | null;

  @ApiPropertyOptional({ enum: VisibilityType })
  @IsOptional()
  @IsEnum(VisibilityType)
  visibility?: VisibilityType;

  // ── Upsert Arrays ──────────────────────────────────────────────────

  @ApiPropertyOptional({ type: [SyncExperienceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncExperienceDto)
  experiences?: SyncExperienceDto[];

  @ApiPropertyOptional({ type: [SyncEducationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncEducationDto)
  educations?: SyncEducationDto[];

  @ApiPropertyOptional({ type: [SyncSkillDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncSkillDto)
  skills?: SyncSkillDto[];

  @ApiPropertyOptional({ type: [SyncSocialLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncSocialLinkDto)
  socialLinks?: SyncSocialLinkDto[];
}
