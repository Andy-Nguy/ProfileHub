import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import type {
  CreateProfileDto,
  UpdateProfileDto,
  CreateExperienceDto,
  CreateEducationDto,
  CreateSkillDto,
} from '../../../../../libs/shared/data-access/src';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ── Profile ────────────────────────────

  @Get('discover')
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

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.profileService.findByUsername(username);
  }

  @Post()
  create(@Body() body: CreateProfileDto & { userId: string }) {
    return this.profileService.create(body.userId, body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(id, dto);
  }

  @Patch(':id/visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.profileService.toggleVisibility(id);
  }

  // ── Experience ─────────────────────────

  @Post(':profileId/experiences')
  addExperience(
    @Param('profileId') profileId: string,
    @Body() dto: CreateExperienceDto,
  ) {
    return this.profileService.addExperience(profileId, dto);
  }

  @Delete('experiences/:id')
  removeExperience(@Param('id') id: string) {
    return this.profileService.removeExperience(id);
  }

  // ── Education ──────────────────────────

  @Post(':profileId/educations')
  addEducation(
    @Param('profileId') profileId: string,
    @Body() dto: CreateEducationDto,
  ) {
    return this.profileService.addEducation(profileId, dto);
  }

  @Delete('educations/:id')
  removeEducation(@Param('id') id: string) {
    return this.profileService.removeEducation(id);
  }

  // ── Skills ─────────────────────────────

  @Post(':profileId/skills')
  addSkill(
    @Param('profileId') profileId: string,
    @Body() dto: CreateSkillDto,
  ) {
    return this.profileService.addSkill(profileId, dto);
  }

  @Delete('skills/:id')
  removeSkill(@Param('id') id: string) {
    return this.profileService.removeSkill(id);
  }
}
