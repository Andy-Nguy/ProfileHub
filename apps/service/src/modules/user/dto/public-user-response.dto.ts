import { ApiProperty } from '@nestjs/swagger';

export class PublicUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  createdAt!: Date;

  constructor(user: { id: string; username: string; role: string; createdAt: Date }) {
    this.id = user.id;
    this.username = user.username;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }
}
