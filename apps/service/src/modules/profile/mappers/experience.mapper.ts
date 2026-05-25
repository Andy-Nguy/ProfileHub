import { Injectable } from '@nestjs/common';
import { ExperienceEntity } from '../../../entities/experience.entity';
import { ExperienceResponseDto } from '../dto';

@Injectable()
export class ExperienceMapper {
  toResponseDto(entity: ExperienceEntity): ExperienceResponseDto {
    return {
      id: entity.id,
      profileId: entity.profileId,
      companyId: entity.companyId,
      title: entity.title,
      company: entity.company,
      companyDetails: entity.companyDetails
        ? {
            id: entity.companyDetails.id,
            name: entity.companyDetails.name,
            domain: entity.companyDetails.domain,
            logoUrl: entity.companyDetails.logoUrl,
          }
        : null,
      location: entity.location,
      employmentType: entity.employmentType,
      startDate: this.toDateOnlyString(entity.startDate),
      endDate: entity.endDate ? this.toDateOnlyString(entity.endDate) : null,
      isCurrent: entity.isCurrent,
      description: entity.description,
      displayOrder: entity.displayOrder,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private toDateOnlyString(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }

    return String(value);
  }
}
