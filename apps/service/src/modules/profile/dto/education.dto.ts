import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ example: 'HCMUT - Bach Khoa University' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  institution!: string;

  @ApiPropertyOptional({ example: "Bachelor's Degree", nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(255)
  degree?: string | null;

  @ApiPropertyOptional({ example: 'Computer Science', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(255)
  fieldOfStudy?: string | null;

  @ApiProperty({ example: '2019-09-01', description: 'ISO date string YYYY-MM-DD' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ example: '2023-06-30', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiPropertyOptional({ nullable: true })
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

export class SyncEducationDto extends CreateEducationDto {
  @ApiPropertyOptional({ example: '9f5ef5b8-9f8c-43a5-9056-2107426d893d' })
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class UpdateEducationDto extends SyncEducationDto {}

export class EducationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  profileId!: string;

  @ApiProperty()
  institution!: string;

  @ApiProperty({ nullable: true })
  degree!: string | null;

  @ApiProperty({ nullable: true })
  fieldOfStudy!: string | null;

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
