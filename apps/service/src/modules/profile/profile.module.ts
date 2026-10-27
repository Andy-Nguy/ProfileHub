import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationEntity } from '../../entities/education.entity';
import { ExperienceEntity } from '../../entities/experience.entity';
import { CompanyEntity } from '../../entities/company.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { SkillEntity } from '../../entities/skill.entity';
import { SocialLinkEntity } from '../../entities/social-link.entity';
import { User } from '../../entities/user.entity';
import { UserModule } from '../user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ProfileEntity,
      User,
      ExperienceEntity,
      CompanyEntity,
      EducationEntity,
      SkillEntity,
      SocialLinkEntity,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
