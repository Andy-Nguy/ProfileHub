import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionEntity } from '../../entities/interaction.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { SkillEntity } from '../../entities/skill.entity';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InteractionEntity, ProfileEntity, SkillEntity])],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
