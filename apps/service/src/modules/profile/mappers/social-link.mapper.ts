import { Injectable } from '@nestjs/common';
import { SocialLinkEntity } from '../../../entities/social-link.entity';
import { SocialLinkResponseDto } from '../dto';

@Injectable()
export class SocialLinkMapper {
  toResponseDto(entity: SocialLinkEntity): SocialLinkResponseDto {
    return {
      id: entity.id,
      profileId: entity.profileId,
      platform: entity.platform as SocialLinkResponseDto['platform'],
      url: entity.url,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
