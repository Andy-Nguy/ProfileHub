import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UpsertProfileDto } from './upsert-profile.dto';

// Tất cả field đều optional, kể cả displayName
export class UpdateProfileDto extends PartialType(UpsertProfileDto) {}

export class UpdateOnboardingDto extends UpsertProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  displayName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  headline: string;
}
