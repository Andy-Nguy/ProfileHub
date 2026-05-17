// profile.controller.ts

import {
  Controller, Get, Post, Body, HttpCode, HttpStatus, Patch, Put, Delete, Param, ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { ProfileEntity } from '../../entities';
import { UpdateProfileDto, UpsertProfileDto, ProfileResponseDto, ExperienceDto, EducationDto, SkillDto, SocialLinkDto } from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ExperienceMapper, EducationMapper, SkillMapper, SocialLinkMapper, ProfileMapper } from './mappers';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {

  constructor(
    private readonly profileService: ProfileService,
    private readonly experienceMapper: ExperienceMapper,
    private readonly educationMapper: EducationMapper,
    private readonly skillMapper: SkillMapper,
    private readonly socialLinkMapper: SocialLinkMapper,
    private readonly profileMapper: ProfileMapper,
  ) { }

  // GET /profiles/mine → full profile of logged-in user
  @Get('mine')
  @ApiOperation({ summary: "Get the authenticated user's own profile with all CV sections" })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  async getMyProfile(@CurrentUser('id') userId: string) {
    const user = await this.profileService.getUserFullProfile(userId);
    const status = await this.profileService.getOnboardingStatus(userId);
    return user.profile;
  }

  // GET /profiles/discover → get discovery feed
  @Public()
  @Get('discover')
  @ApiOperation({ summary: 'Get discovery feed' })
  async getDiscoveryFeed() {
    const users = await this.profileService.getAllUsersFullProfile();
    const profiles = users.map(u => {
      if (u.profile) {
        u.profile.user = u; // Attach user to profile for mapping
      }
      return u.profile;
    }).filter((p): p is ProfileEntity => p !== null);
    return this.profileMapper.toDiscoveryFeedResponseDto(profiles, profiles.length, 1, profiles.length || 1);
  }

  // GET /profiles/u/:username → get full profile by username
  @Public()
  @Get('u/:username')
  @ApiOperation({ summary: 'Get full profile by username' })

  async getProfileByUsername(@Param('username') username: string) {
    const user = await this.profileService.getProfileByUsername(username);
    return user.profile;
  }

  // GET /profiles/:id → get profile details by profile ID
  @Get(':id')

  @ApiOperation({ summary: 'Get profile details by profile ID' })
  async getProfileById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.profileService.getProfileByProfileId(id);
    return user.profile;
  }


  // PATCH /profiles/me → update basic profile
  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update authenticated user profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    // Create or update authenticated user profile
    const profile = await this.profileService.upsertProfile(userId, dto);
    return profile;
  }

  // ── CV SECTION CRUD: SKILL ────────────────────────────────────────

  @Post('me/skills')
  @HttpCode(HttpStatus.CREATED)
  async createSkill(@CurrentUser('id') userId: string, @Body() dto: SkillDto) {
    const skill = await this.profileService.createSkill(userId, dto);
    return this.skillMapper.toResponseDto(skill);
  }

  @Put('me/skills/:id')
  @HttpCode(HttpStatus.OK)
  async updateSkill(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SkillDto) {
    const skill = await this.profileService.updateSkill(userId, id, dto);
    return this.skillMapper.toResponseDto(skill);
  }

  @Delete('me/skills/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSkill(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.deleteSkill(userId, id);
  }

  // ── CV SECTION CRUD: EXPERIENCE ───────────────────────────────────

  @Post('me/experiences')
  @HttpCode(HttpStatus.CREATED)
  async createExperience(@CurrentUser('id') userId: string, @Body() dto: ExperienceDto) {
    const exp = await this.profileService.createExperience(userId, dto);
    return this.experienceMapper.toResponseDto(exp);
  }

  @Put('me/experiences/:id')
  @HttpCode(HttpStatus.OK)
  async updateExperience(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: ExperienceDto) {
    const exp = await this.profileService.updateExperience(userId, id, dto);
    return this.experienceMapper.toResponseDto(exp);
  }

  @Delete('me/experiences/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteExperience(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.deleteExperience(userId, id);
  }

  // ── CV SECTION CRUD: EDUCATION ────────────────────────────────────

  @Post('me/educations')
  @HttpCode(HttpStatus.CREATED)
  async createEducation(@CurrentUser('id') userId: string, @Body() dto: EducationDto) {
    const edu = await this.profileService.createEducation(userId, dto);
    return this.educationMapper.toResponseDto(edu);
  }

  @Put('me/educations/:id')
  @HttpCode(HttpStatus.OK)
  async updateEducation(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: EducationDto) {
    const edu = await this.profileService.updateEducation(userId, id, dto);
    return this.educationMapper.toResponseDto(edu);
  }

  @Delete('me/educations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEducation(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.deleteEducation(userId, id);
  }

  // ── CV SECTION CRUD: SOCIAL LINK ──────────────────────────────────

  @Post('me/social-links')
  @HttpCode(HttpStatus.CREATED)
  async createSocialLink(@CurrentUser('id') userId: string, @Body() dto: SocialLinkDto) {
    const sl = await this.profileService.createSocialLink(userId, dto);
    return this.socialLinkMapper.toResponseDto(sl);
  }

  @Put('me/social-links/:id')
  @HttpCode(HttpStatus.OK)
  async updateSocialLink(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SocialLinkDto) {
    const sl = await this.profileService.updateSocialLink(userId, id, dto);
    return this.socialLinkMapper.toResponseDto(sl);
  }

  @Delete('me/social-links/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSocialLink(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.deleteSocialLink(userId, id);
  }
}

