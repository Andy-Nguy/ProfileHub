import { ApiProperty } from '@nestjs/swagger';

export class AuthMeProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ nullable: true })
  headline!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty()
  visibility!: string;
}

export class AuthMeUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty({ type: () => AuthMeProfileDto, nullable: true })
  profile!: AuthMeProfileDto | null;
}

export class AuthMeResponseDto {
  @ApiProperty()
  authenticated!: boolean;

  @ApiProperty({ type: () => AuthMeUserDto })
  user!: AuthMeUserDto;
}
