import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SkillCategory } from '../../../entities/skill.entity';

export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ enum: SkillCategory, example: SkillCategory.LANGUAGE })
  @IsOptional()
  @IsEnum(SkillCategory)
  category?: SkillCategory;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class SyncSkillDto extends CreateSkillDto {
  @ApiPropertyOptional({ example: '9f5ef5b8-9f8c-43a5-9056-2107426d893d' })
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class UpdateSkillDto extends SyncSkillDto {}

export class SkillResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  profileId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: SkillCategory })
  category!: SkillCategory;

  @ApiProperty()
  endorsementCount!: number;

  @ApiProperty()
  displayOrder!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
