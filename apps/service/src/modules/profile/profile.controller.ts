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
  ApiParam,
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
  SuccessResponseDto,
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
  @ApiResponse({ status: 200, type: ProfileResponseDto, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getMyProfile(
    @CurrentUser('id') userId: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getUserFullProfile(userId);
  }

  // GET /profiles/discover → get discovery feed
  @Public()
  @Get('discover')
  @ApiOperation({ summary: 'Get paginated discovery feed with optional search' })
  @ApiResponse({ status: 200, type: DiscoveryFeedResponseDto, description: 'Discovery feed items retrieved successfully' })
  async getDiscoveryFeed(
    @Query() query: DiscoveryQueryDto,
  ): Promise<DiscoveryFeedResponseDto> {
    return this.profileService.getDiscoveryFeed(query);
  }

  // GET /profiles/u/:username → get full profile by username
  @Public()
  @Get('u/:username')
  @ApiOperation({ summary: 'Get full public profile by username' })
  @ApiParam({ name: 'username', description: 'Username of the target user' })
  @ApiResponse({ status: 200, type: ProfileResponseDto, description: 'Public profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileByUsername(
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByUsername(username);
  }

  // PATCH /profiles/onboarding → complete first-time profile setup
  @Patch('onboarding')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete onboarding profile setup for the authenticated user' })
  @ApiResponse({ status: 200, type: OnboardingStatusResponseDto, description: 'Onboarding completed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateOnboarding(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateOnboardingDto,
  ): Promise<OnboardingStatusResponseDto> {
    return this.profileService.updateOnboarding(userId, dto);
  }

  // GET /profiles/:id → get profile details by profile ID
  @Get(':id')
  @ApiOperation({ summary: 'Get profile details by profile UUID' })
  @ApiParam({ name: 'id', description: 'Profile UUID' })
  @ApiResponse({ status: 200, type: ProfileResponseDto, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByProfileId(id);
  }

  // PATCH /profiles/me → update basic profile
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update authenticated user basic profile information' })
  @ApiResponse({ status: 200, type: ProfileResponseDto, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.upsertProfile(userId, dto);
  }

  // ── CV SECTION CRUD: SKILL ────────────────────────────────────────

  @Post('me/skills')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new skill to authenticated user profile' })
  @ApiResponse({ status: 201, type: SuccessResponseDto, description: 'Skill added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Skill already exists' })
  createSkill(@CurrentUser('id') userId: string, @Body() dto: SkillDto) {
    return this.profileService.createSkill(userId, dto);
  }

  @Put('me/skills/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing skill by ID' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiResponse({ status: 200, type: SuccessResponseDto, description: 'Skill updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  updateSkill(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SkillDto,
  ) {
    return this.profileService.updateSkill(userId, id, dto);
  }

  @Delete('me/skills/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a skill from authenticated user profile' })
  @ApiParam({ name: 'id', description: 'Skill UUID' })
  @ApiResponse({ status: 204, description: 'Skill deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  deleteSkill(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteSkill(userId, id);
  }

  // ── CV SECTION CRUD: EXPERIENCE ───────────────────────────────────

  @Post('me/experiences')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a work experience to authenticated user profile' })
  @ApiResponse({ status: 201, type: SuccessResponseDto, description: 'Experience added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createExperience(
    @CurrentUser('id') userId: string,
    @Body() dto: ExperienceDto,
  ) {
    return this.profileService.createExperience(userId, dto);
  }

  @Put('me/experiences/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a work experience by ID' })
  @ApiParam({ name: 'id', description: 'Experience UUID' })
  @ApiResponse({ status: 200, type: SuccessResponseDto, description: 'Experience updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  updateExperience(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ExperienceDto,
  ) {
    return this.profileService.updateExperience(userId, id, dto);
  }

  @Delete('me/experiences/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a work experience from authenticated user profile' })
  @ApiParam({ name: 'id', description: 'Experience UUID' })
  @ApiResponse({ status: 204, description: 'Experience deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  deleteExperience(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteExperience(userId, id);
  }

  // ── CV SECTION CRUD: EDUCATION ────────────────────────────────────

  @Post('me/educations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an education entry to authenticated user profile' })
  @ApiResponse({ status: 201, type: SuccessResponseDto, description: 'Education entry added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createEducation(
    @CurrentUser('id') userId: string,
    @Body() dto: EducationDto,
  ) {
    return this.profileService.createEducation(userId, dto);
  }

  @Put('me/educations/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an education entry by ID' })
  @ApiParam({ name: 'id', description: 'Education UUID' })
  @ApiResponse({ status: 200, type: SuccessResponseDto, description: 'Education entry updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Education entry not found' })
  updateEducation(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EducationDto,
  ) {
    return this.profileService.updateEducation(userId, id, dto);
  }

  @Delete('me/educations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an education entry from authenticated user profile' })
  @ApiParam({ name: 'id', description: 'Education UUID' })
  @ApiResponse({ status: 204, description: 'Education entry deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Education entry not found' })
  deleteEducation(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteEducation(userId, id);
  }

  // ── CV SECTION CRUD: SOCIAL LINK ──────────────────────────────────

  @Post('me/social-links')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a social media link to authenticated user profile' })
  @ApiResponse({ status: 201, type: SuccessResponseDto, description: 'Social link added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Social link for this platform already exists' })
  createSocialLink(
    @CurrentUser('id') userId: string,
    @Body() dto: SocialLinkDto,
  ) {
    return this.profileService.createSocialLink(userId, dto);
  }

  @Put('me/social-links/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a social media link by ID' })
  @ApiParam({ name: 'id', description: 'Social link UUID' })
  @ApiResponse({ status: 200, type: SuccessResponseDto, description: 'Social link updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  updateSocialLink(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SocialLinkDto,
  ) {
    return this.profileService.updateSocialLink(userId, id, dto);
  }

  @Delete('me/social-links/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a social media link from authenticated user profile' })
  @ApiParam({ name: 'id', description: 'Social link UUID' })
  @ApiResponse({ status: 204, description: 'Social link deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Social link not found' })
  deleteSocialLink(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.profileService.deleteSocialLink(userId, id);
  }
}
