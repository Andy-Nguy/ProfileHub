import { ApiProperty } from '@nestjs/swagger';
import { OnboardingProfileDto } from './onboarding-profile.dto';

export class OnboardingStatusDto {
  @ApiProperty()
  needsOnboarding!: boolean;

  @ApiProperty({ minimum: 0, maximum: 100 })
  profileCompletion!: number;

  @ApiProperty({ type: () => OnboardingProfileDto, nullable: true })
  profile!: OnboardingProfileDto | null;
}
