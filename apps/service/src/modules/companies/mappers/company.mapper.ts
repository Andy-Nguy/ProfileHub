import { Injectable } from '@nestjs/common';
import { CompanyEntity } from '../../../entities/company.entity';
import { CompanyResponseDto } from '../dto';

@Injectable()
export class CompanyMapper {
  toResponseDto(entity: CompanyEntity): CompanyResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      domain: entity.domain,
      logoUrl: entity.logoUrl,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  toResponseDtos(entities: CompanyEntity[]): CompanyResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}

