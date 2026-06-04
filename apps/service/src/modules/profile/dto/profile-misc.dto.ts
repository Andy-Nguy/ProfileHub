import { IsString, IsNotEmpty, IsUrl, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { SkillCategory } from '@profilehub/types';

export class SkillDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsEnum(SkillCategory)
  @IsOptional()
  category?: SkillCategory;
}

export class SocialLinkDto {
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsUrl()
  url!: string;
}
