import { Injectable } from '@nestjs/common';
import { EducationEntity } from '../../../entities/education.entity';
import { EducationResponseDto } from '../dto';

@Injectable()
export class EducationMapper {
  toResponseDto(entity: EducationEntity): EducationResponseDto {
    return {
      id: entity.id,
      profileId: entity.profileId,
      institution: entity.institution,
      degree: entity.degree,
      fieldOfStudy: entity.fieldOfStudy,
      startDate: this.toDateOnlyString(entity.startDate),
      endDate: entity.endDate ? this.toDateOnlyString(entity.endDate) : null,
      isCurrent: entity.isCurrent,
      institutionLogoUrl: entity.institutionLogoUrl ?? null,
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
