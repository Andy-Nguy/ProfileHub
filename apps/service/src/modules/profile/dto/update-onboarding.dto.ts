import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { VisibilityType } from '../../../entities';

export class UpdateOnboardingDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({ example: 'Backend Engineer', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsString()
  @MaxLength(220)
  headline?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', nullable: true })
  @IsOptional()
  @ValidateIf((_obj, value) => value !== null)
  @IsUrl()
  @MaxLength(2048)
  avatarUrl?: string | null;

  @ApiPropertyOptional({ enum: VisibilityType })
  @IsOptional()
  @IsEnum(VisibilityType)
  visibility?: VisibilityType;
}
