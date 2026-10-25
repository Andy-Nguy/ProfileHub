import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  domain: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl: string | null;

  @ApiProperty()
  createdAt: string;
}

