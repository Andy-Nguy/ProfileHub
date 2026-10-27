import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import {
  UpdateOnboardingDto,
  UpdateProfileDto,
  ProfileResponseDto,
  OnboardingStatusResponseDto,
  DiscoveryFeedResponseDto,
  DiscoveryQueryDto,
  ExperienceDto,
  EducationDto,
  SkillDto,
  SocialLinkDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // GET /profiles/mine → full profile of logged-in user
  @Get('mine')
  @ApiOperation({
    summary: "Get the authenticated user's own profile with all CV sections",
  })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getMyProfile(
    @CurrentUser('id') userId: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getUserFullProfile(userId);
  }

  // GET /profiles/discover → get discovery feed
  @Public()
  @Get('discover')
  @ApiOperation({ summary: 'Get discovery feed' })
  @ApiResponse({ status: 200, type: DiscoveryFeedResponseDto })
  async getDiscoveryFeed(
    @Query() query: DiscoveryQueryDto,
  ): Promise<DiscoveryFeedResponseDto> {
    return this.profileService.getDiscoveryFeed(query);
  }

  // GET /profiles/u/:username → get full profile by username
  @Public()
  @Get('u/:username')
  @ApiOperation({ summary: 'Get full profile by username' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getProfileByUsername(
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByUsername(username);
  }

  // PATCH /profiles/onboarding → complete first-time profile setup
  @Patch('onboarding')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete onboarding for the authenticated user' })
  @ApiResponse({ status: 200, type: OnboardingStatusResponseDto })
  async updateOnboarding(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateOnboardingDto,
  ): Promise<OnboardingStatusResponseDto> {
    return this.profileService.updateOnboarding(userId, dto);
  }

  // GET /profiles/:id → get profile details by profile ID
  @Get(':id')
  @ApiOperation({ summary: 'Get profile details by profile ID' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getProfileById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByProfileId(id);
  }

  // PATCH /profiles/me → update basic profile
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update authenticated user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.upsertProfile(userId, dto);
  }

  // ── CV SECTION CRUD: SKILL ────────────────────────────────────────

  @Post('me/skills')
  @HttpCode(HttpStatus.CREATED)
  createSkill(@CurrentUser('id') userId: string, @Body() dto: SkillDto) {
    return this.profileService.createSkill(userId, dto);
  }

  @Put('me/skills/:id')
  @HttpCode(HttpStatus.OK)
  updateSkill(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SkillDto,
  ) {
    return this.profileService.updateSkill(userId, id, dto);
  }

  @Delete('me/skills/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSkill(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteSkill(userId, id);
  }

  // ── CV SECTION CRUD: EXPERIENCE ───────────────────────────────────

  @Post('me/experiences')
  @HttpCode(HttpStatus.CREATED)
  createExperience(
    @CurrentUser('id') userId: string,
    @Body() dto: ExperienceDto,
  ) {
    return this.profileService.createExperience(userId, dto);
  }

  @Put('me/experiences/:id')
  @HttpCode(HttpStatus.OK)
  updateExperience(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ExperienceDto,
  ) {
    return this.profileService.updateExperience(userId, id, dto);
  }

  @Delete('me/experiences/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteExperience(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteExperience(userId, id);
  }

  // ── CV SECTION CRUD: EDUCATION ────────────────────────────────────

  @Post('me/educations')
  @HttpCode(HttpStatus.CREATED)
  createEducation(
    @CurrentUser('id') userId: string,
    @Body() dto: EducationDto,
  ) {
    return this.profileService.createEducation(userId, dto);
  }

  @Put('me/educations/:id')
  @HttpCode(HttpStatus.OK)
  updateEducation(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EducationDto,
  ) {
    return this.profileService.updateEducation(userId, id, dto);
  }

  @Delete('me/educations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEducation(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteEducation(userId, id);
  }

  // ── CV SECTION CRUD: SOCIAL LINK ──────────────────────────────────

  @Post('me/social-links')
  @HttpCode(HttpStatus.CREATED)
  createSocialLink(
    @CurrentUser('id') userId: string,
    @Body() dto: SocialLinkDto,
  ) {
    return this.profileService.createSocialLink(userId, dto);
  }

  @Put('me/social-links/:id')
  @HttpCode(HttpStatus.OK)
  updateSocialLink(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SocialLinkDto,
  ) {
    return this.profileService.updateSocialLink(userId, id, dto);
  }

  @Delete('me/social-links/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSocialLink(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteSocialLink(userId, id);
  }
}
