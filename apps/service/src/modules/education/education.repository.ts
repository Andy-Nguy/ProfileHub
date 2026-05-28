import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationEntity } from '../../entities/education.entity';

/**
 * Queries distinct institution names + logos from the educations table.
 * Education has no dedicated `institutions` table – we derive the catalogue
 * from previously saved education entries that have a non-null logo.
 */
export interface EducationSearchResult {
  institution: string;
  institutionLogoUrl: string | null;
}

@Injectable()
export class EducationRepository {
  constructor(
    @InjectRepository(EducationEntity)
    private readonly educationRepo: Repository<EducationEntity>,
  ) {}

  /**
   * Search distinct institution names that match the query.
   * Prioritises entries that have a logo so the caller can skip re-uploading.
   */
  async search(query: string, limit = 10): Promise<EducationSearchResult[]> {
    // Sub-query: for each institution name, pick the row that has a logo (if any)
    const rows: Array<{ institution: string; institution_logo_url: string | null }> =
      await this.educationRepo
        .createQueryBuilder('edu')
        .select('DISTINCT ON (LOWER(edu.institution_name)) edu.institution_name', 'institution')
        .addSelect('edu.institution_logo_url', 'institution_logo_url')
        .where('edu.institution_name ILIKE :query', { query: `%${query}%` })
        .orderBy('LOWER(edu.institution_name)', 'ASC')
        // Prefer rows with a logo over those without
        .addOrderBy('edu.institution_logo_url', 'DESC', 'NULLS LAST')
        .limit(limit)
        .getRawMany();

    return rows.map((r) => ({
      institution: r.institution,
      institutionLogoUrl: r.institution_logo_url ?? null,
    }));
  }
}
