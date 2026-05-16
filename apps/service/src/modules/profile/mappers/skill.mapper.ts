import { Injectable } from '@nestjs/common';
import { SkillEntity } from '../../../entities/skill.entity';
import { SkillResponseDto } from '../dto';

@Injectable()
export class SkillMapper {
  toResponseDto(entity: SkillEntity): SkillResponseDto {
    return {
      id: entity.id,
      profileId: entity.profileId,
      name: entity.name,
      category: entity.category,
      endorsementCount: entity.endorsementCount,
      displayOrder: entity.displayOrder,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
