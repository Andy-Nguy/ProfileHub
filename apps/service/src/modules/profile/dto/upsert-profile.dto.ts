// dto/upsert-profile.dto.ts
import { IsString, IsOptional, IsEnum, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisibilityTypeEnum } from '@profilehub/types';

export class UpsertProfileDto {
  @ApiProperty({ example: 'Andy Nguyen' })
  @IsString()
  @MaxLength(100)
  displayName: string;

  @ApiPropertyOptional({ example: 'Senior Full Stack Engineer' })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  headline?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiPropertyOptional({ example: 'Software engineer passionate about building high-performance web applications.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'Ho Chi Minh City, Vietnam' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiPropertyOptional({ example: 'Information Technology' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({ enum: VisibilityTypeEnum, default: VisibilityTypeEnum.PUBLIC })
  @IsOptional()
  @IsEnum(VisibilityTypeEnum)
  visibility?: VisibilityTypeEnum;
}

