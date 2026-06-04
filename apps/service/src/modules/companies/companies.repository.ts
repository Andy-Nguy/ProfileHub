import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../entities/company.entity';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepo: Repository<CompanyEntity>,
  ) {}

  async findById(id: string): Promise<CompanyEntity | null> {
    return this.companyRepo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<CompanyEntity | null> {
    return this.companyRepo
      .createQueryBuilder('company')
      .where('LOWER(company.name) = LOWER(:name)', { name })
      .getOne();
  }

  async search(query: string, limit = 10): Promise<CompanyEntity[]> {
    return this.companyRepo
      .createQueryBuilder('company')
      .where('company.name ILIKE :query', { query: `%${query}%` })
      .orWhere('company.domain ILIKE :query', { query: `%${query}%` })
      .orderBy('company.name', 'ASC')
      .limit(limit)
      .getMany();
  }

  async save(payload: {
    name: string;
    domain?: string | null;
    logoUrl?: string | null;
  }): Promise<CompanyEntity> {
    const company = this.companyRepo.create({
      name: payload.name,
      domain: payload.domain ?? null,
      logoUrl: payload.logoUrl ?? null,
    });

    return this.companyRepo.save(company);
  }
}

