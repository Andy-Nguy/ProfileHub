import { Injectable } from '@nestjs/common';
import {
  EducationRepository,
  EducationSearchResult,
} from './education.repository';

@Injectable()
export class EducationService {
  constructor(
    private readonly educationRepository: EducationRepository,
  ) {}

  async search(query: string): Promise<EducationSearchResult[]> {
    return this.educationRepository.search(query, 10);
  }
}
