import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OnboardingStatusDto, UpdateOnboardingDto } from './dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DiscoveryFeedResponseDto, ProfileResponseDto } from './dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ─────────────────────────────────────────────────────────────────────
  // PUBLIC ROUTES
  // ─────────────────────────────────────────────────────────────────────

  @Public()
  @Get('discover')
  @ApiOperation({ summary: 'Discovery feed — browse public profiles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, type: DiscoveryFeedResponseDto })
  discover(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.profileService.getDiscoveryFeed(
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
  }

  @Public()
  @Get('u/:username')
  @ApiOperation({ summary: 'Get a public profile by username' })
  @ApiParam({ name: 'username', description: 'The username slug' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  getByUsername(@Param('username') username: string) {
    return this.profileService.findByUsername(username);
  }

  // ─────────────────────────────────────────────────────────────────────
  // AUTHENTICATED — OWN PROFILE
  // ─────────────────────────────────────────────────────────────────────

  @Get('mine')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user\'s own profile with all CV sections' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.profileService.getMyProfile(userId);
  }

  @Patch('mine')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the authenticated user\'s profile fields' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateMyProfile(userId, dto);
  }

  @Patch('onboarding')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the authenticated user\'s onboarding profile' })
  @ApiResponse({ status: 200, type: OnboardingStatusDto })
  updateOnboarding(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateOnboardingDto,
  ) {
    return this.profileService.updateOnboardingProfile(userId, dto);
  }
}
