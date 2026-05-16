import { ApiProperty } from '@nestjs/swagger';
import { VisibilityType } from '../../../entities';

export class OnboardingProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ nullable: true })
  headline!: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ enum: VisibilityType })
  visibility!: VisibilityType;
}
