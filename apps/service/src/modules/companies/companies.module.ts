import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../../entities/company.entity';
import { StorageModule } from '../storage/storage.module';
import { CompaniesController } from './companies.controller';
import { CompanyRepository } from './companies.repository';
import { CompaniesService } from './companies.service';
import { CompanyMapper } from './mappers/company.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    StorageModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyRepository, CompanyMapper],
  exports: [CompaniesService, CompanyRepository],
})
export class CompaniesModule {}

