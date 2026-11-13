import { IsString, IsNotEmpty, IsUrl, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillCategory } from '@profilehub/types';

export class SkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ enum: SkillCategory, example: SkillCategory.TECHNICAL })
  @IsEnum(SkillCategory)
  @IsOptional()
  category?: SkillCategory;
}

export class SocialLinkDto {
  @ApiProperty({ example: 'github' })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({ example: 'https://github.com/octocat' })
  @IsUrl()
  url: string;
}
