// dto/upsert-profile.dto.ts
import { IsString, IsOptional, IsEnum, IsUrl, MaxLength } from 'class-validator';
import { VisibilityTypeEnum } from '../../../entities';

export class UpsertProfileDto {
  @IsString()
  @MaxLength(100)
  displayName: string;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  headline?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsEnum(VisibilityTypeEnum)
  visibility?: VisibilityTypeEnum;
}
