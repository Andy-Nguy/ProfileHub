import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class SkillDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name!: string;
}

export class SocialLinkDto {
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsUrl()
  url!: string;
}
