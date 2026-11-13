import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthMeProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  displayName: string;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty()
  visibility: string;
}

export class AuthMeUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;

  @ApiPropertyOptional({ type: () => AuthMeProfileDto, nullable: true })
  profile?: AuthMeProfileDto | null;
}

export class AuthMeResponseDto {
  @ApiProperty()
  authenticated: boolean;

  @ApiProperty({ example: false })
  needsOnboarding: boolean;

  @ApiProperty({ example: 85 })
  profileCompletion: number;

  @ApiProperty({ type: () => AuthMeUserDto })
  user: AuthMeUserDto;
}

