import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { EmploymentType } from '../../../entities/experience.entity';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  company!: string;

  @ApiPropertyOptional({ example: 'Ho Chi Minh City', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(150)
  location?: string | null;

  @ApiPropertyOptional({ enum: EmploymentType, example: EmploymentType.FULL_TIME })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiProperty({ example: '2023-01-15', description: 'ISO date string YYYY-MM-DD' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ example: '2024-06-30', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiPropertyOptional({ example: 'Led a team of 5 engineers...', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class SyncExperienceDto extends CreateExperienceDto {
  @ApiPropertyOptional({ example: '9f5ef5b8-9f8c-43a5-9056-2107426d893d' })
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class UpdateExperienceDto extends SyncExperienceDto {}

export class ExperienceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  profileId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  company!: string;

  @ApiProperty({ nullable: true })
  location!: string | null;

  @ApiProperty({ enum: EmploymentType })
  employmentType!: EmploymentType;

  @ApiProperty()
  startDate!: string;

  @ApiProperty({ nullable: true })
  endDate!: string | null;

  @ApiProperty()
  isCurrent!: boolean;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty()
  displayOrder!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
