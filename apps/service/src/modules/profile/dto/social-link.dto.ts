import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';
import { SocialPlatform } from '../../../../../../libs/shared/types/social.types';

export class CreateSocialLinkDto {
  @ApiProperty({ enum: SocialPlatform, example: SocialPlatform.GITHUB })
  @IsEnum(SocialPlatform)
  platform!: SocialPlatform;

  @ApiProperty({ example: 'https://github.com/johndoe' })
  @IsUrl()
  @MaxLength(2048)
  url!: string;
}

export class SyncSocialLinkDto extends CreateSocialLinkDto {
  @ApiPropertyOptional({ example: '9f5ef5b8-9f8c-43a5-9056-2107426d893d' })
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class UpdateSocialLinkDto {
  @ApiPropertyOptional({ example: '9f5ef5b8-9f8c-43a5-9056-2107426d893d' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ enum: SocialPlatform, example: SocialPlatform.GITHUB })
  @IsOptional()
  @IsEnum(SocialPlatform)
  platform?: SocialPlatform;

  @ApiPropertyOptional({ example: 'https://github.com/newusername' })
  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  url?: string;
}

export class SocialLinkResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  profileId!: string;

  @ApiProperty()
  platform!: SocialPlatform;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
