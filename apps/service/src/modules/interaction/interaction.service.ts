import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InteractionEntity } from '../../entities/interaction.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { SkillEntity } from '../../entities/skill.entity';
import {
  InteractionTargetType,
  InteractionType,
  type CreateInteractionDto,
} from '../../../../../libs/shared/data-access/src';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(InteractionEntity) private readonly repo: Repository<InteractionEntity>,
    @InjectRepository(ProfileEntity) private readonly profileRepo: Repository<ProfileEntity>,
    @InjectRepository(SkillEntity) private readonly skillRepo: Repository<SkillEntity>,
  ) {}

  async toggle(userId: string, dto: CreateInteractionDto) {
    const existing = await this.repo.findOne({
      where: {
        userId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        interactionType: dto.interactionType,
      },
    });

    if (existing) {
      await this.repo.remove(existing);
      await this.updateCount(dto, -1);
      return { active: false };
    }

    const interaction = this.repo.create({ userId, ...dto });
    await this.repo.save(interaction);
    await this.updateCount(dto, 1);
    return { active: true };
  }

  private async updateCount(dto: CreateInteractionDto, delta: number) {
    if (dto.targetType === InteractionTargetType.PROFILE && dto.interactionType === InteractionType.LIKE) {
      await this.profileRepo.increment({ id: dto.targetId }, 'likesCount', delta);
    }
    if (dto.targetType === InteractionTargetType.SKILL && dto.interactionType === InteractionType.ENDORSE) {
      await this.skillRepo.increment({ id: dto.targetId }, 'endorsementCount', delta);
    }
  }
}
