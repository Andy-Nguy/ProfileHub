import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EducationSearchResultDto {
  @ApiProperty()
  institution!: string;

  @ApiPropertyOptional({ nullable: true })
  institutionLogoUrl!: string | null;
}
