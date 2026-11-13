import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UpsertProfileDto } from './upsert-profile.dto';

// Tất cả field đều optional, kể cả displayName
export class UpdateProfileDto extends PartialType(UpsertProfileDto) {}

export class UpdateOnboardingDto extends UpsertProfileDto {
  @ApiProperty({ example: 'Andy Nguyen' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  displayName: string;

  @ApiProperty({ example: 'Full Stack Engineer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  headline: string;
}

