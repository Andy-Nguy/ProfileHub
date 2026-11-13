import { IsString, IsOptional, IsDateString, IsBoolean, ValidateIf, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentType } from '@profilehub/types';

export class ExperienceDto {
  @ApiProperty({ example: 'Senior Software Engineer' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  company: string;

  @ApiPropertyOptional({ example: 'd3b07384-d113-494b-9c8e-aa67439366e4' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ example: 'Ho Chi Minh City, Vietnam' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: EmploymentType, example: EmploymentType.FULL_TIME })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiProperty({ example: '2022-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @ValidateIf((o) => !o.isCurrent)
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCurrent: boolean;

  @ApiPropertyOptional({ example: 'Developed scalable microservices and led a team of 5 engineers.' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class EducationDto {
  @ApiProperty({ example: 'Ho Chi Minh City University of Technology' })
  @IsString()
  institution: string;

  @ApiPropertyOptional({ example: "Bachelor's Degree" })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @ApiProperty({ example: '2018-09-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2022-06-30' })
  @ValidateIf((o) => !o.isCurrent)
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCurrent: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  institutionLogoUrl?: string;

  @ApiPropertyOptional({ example: 'Graduated with Distinction.' })
  @IsOptional()
  @IsString()
  description?: string;
}
