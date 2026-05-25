import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CompanyEntity } from '../../entities/company.entity';
import { StorageService } from '../storage/storage.service';
import { CompanyRepository } from './companies.repository';
import { CreateCompanyDto } from './dto';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly storageService: StorageService,
  ) {}

  async search(query: string): Promise<CompanyEntity[]> {
    return this.companyRepository.search(query, 10);
  }

  async getById(id: string): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async create(
    dto: CreateCompanyDto,
    file?: Express.Multer.File,
  ): Promise<CompanyEntity> {
    const name = dto.name.trim();
    const domain = dto.domain?.trim().toLowerCase() || null;

    const existing = await this.companyRepository.findByName(name);
    if (existing) {
      this.logger.debug(`Company already exists; skipping logo upload`, {
        companyId: existing.id,
        name,
      });
      return existing;
    }

    let logoUrl: string | null = null;
    if (file) {
      logoUrl = await this.storageService.uploadCompanyLogo(domain ?? name, file);
    }

    try {
      return await this.companyRepository.save({
        name,
        domain,
        logoUrl,
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const company = await this.companyRepository.findByName(name);
        if (company) return company;
      }

      throw new ConflictException('Unable to create company');
    }
  }
}

