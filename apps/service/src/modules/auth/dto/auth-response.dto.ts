import { ApiProperty } from '@nestjs/swagger';
import { AuthMeUserDto } from './auth-me-response.dto';

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully.' })
  message: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: () => AuthMeUserDto })
  user: AuthMeUserDto;

  @ApiProperty({ example: false })
  needsOnboarding: boolean;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
}
