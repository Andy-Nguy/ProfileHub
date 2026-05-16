import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../entities/user.entity';
import { ExperienceEntity } from '../../entities/experience.entity';
import { EducationEntity } from '../../entities/education.entity';
import { SkillEntity } from '../../entities/skill.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ProfileEntity,
      UserEntity,
      ExperienceEntity,
      EducationEntity,
      SkillEntity,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
