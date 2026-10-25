import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationEntity } from '../../entities/education.entity';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { EducationRepository } from './education.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EducationEntity])],
  controllers: [EducationController],
  providers: [EducationService, EducationRepository],
  exports: [EducationService],
})
export class EducationModule {}
