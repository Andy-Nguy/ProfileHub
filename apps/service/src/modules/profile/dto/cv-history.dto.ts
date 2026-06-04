import { IsString, IsOptional, IsDateString, IsBoolean, ValidateIf, IsEnum, IsUUID } from 'class-validator';
import { EmploymentType } from '../../../entities/experience.entity';

export class ExperienceDto {
  @IsString()
  title!: string;

  @IsString()
  company!: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsDateString()
  startDate!: string;

  @ValidateIf((o) => !o.isCurrent)
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  isCurrent!: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class EducationDto {
  @IsString()
  institution!: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsDateString()
  startDate!: string;

  @ValidateIf((o) => !o.isCurrent)
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  isCurrent!: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
