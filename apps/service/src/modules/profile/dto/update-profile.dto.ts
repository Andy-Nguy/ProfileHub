import { PartialType } from '@nestjs/mapped-types';
import { UpsertProfileDto } from './upsert-profile.dto';

// Tất cả field đều optional, kể cả displayName
export class UpdateProfileDto extends PartialType(UpsertProfileDto) {}
