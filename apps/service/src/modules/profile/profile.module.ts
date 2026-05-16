import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../entities/user.entity';
import { ExperienceEntity } from '../../entities/experience.entity';
import { EducationEntity } from '../../entities/education.entity';
import { SkillEntity } from '../../entities/skill.entity';
import { SocialLinkEntity } from '../../entities/social-link.entity';
import { UserModule } from '../user/user.module';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import {
  EducationMapper,
  ExperienceMapper,
  ProfileMapper,
  SkillMapper,
  SocialLinkMapper,
} from './mappers';
import { ProfileAggregateService } from './profile-aggregate.service';
import { ProfileDiscoveryService } from './profile-discovery.service';
import { ProfileOnboardingService } from './profile-onboarding.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ProfileEntity,
      UserEntity,
      ExperienceEntity,
      EducationEntity,
      SkillEntity,
      SocialLinkEntity,
    ]),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ProfileAggregateService,
    ProfileDiscoveryService,
    ProfileOnboardingService,
    ProfileRepository,
    ExperienceMapper,
    EducationMapper,
    SkillMapper,
    SocialLinkMapper,
    ProfileMapper,
  ],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
