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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ── Public Routes ───────────────────────────────────────────────────

  @Public()
  @Get('discover')
  @ApiOperation({ summary: 'Get public profiles discovery feed' })
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
  @Get(':username')
  @ApiOperation({ summary: 'Get a profile by username' })
  getByUsername(@Param('username') username: string) {
    return this.profileService.findByUsername(username);
  }

  // ── Protected Routes ────────────────────────────────────────────────

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a profile' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.profileService.update(id, dto);
  }

  @Patch(':id/visibility')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle profile visibility' })
  toggleVisibility(@Param('id') id: string) {
    return this.profileService.toggleVisibility(id);
  }

  // ── Experience ──────────────────────────────────────────────────────

  @Post(':profileId/experiences')
  @ApiBearerAuth()
  addExperience(@Param('profileId') profileId: string, @Body() dto: any) {
    return this.profileService.addExperience(profileId, dto);
  }

  @Delete('experiences/:id')
  @ApiBearerAuth()
  removeExperience(@Param('id') id: string) {
    return this.profileService.removeExperience(id);
  }

  // ── Education ───────────────────────────────────────────────────────

  @Post(':profileId/educations')
  @ApiBearerAuth()
  addEducation(@Param('profileId') profileId: string, @Body() dto: any) {
    return this.profileService.addEducation(profileId, dto);
  }

  @Delete('educations/:id')
  @ApiBearerAuth()
  removeEducation(@Param('id') id: string) {
    return this.profileService.removeEducation(id);
  }

  // ── Skills ──────────────────────────────────────────────────────────

  @Post(':profileId/skills')
  @ApiBearerAuth()
  addSkill(@Param('profileId') profileId: string, @Body() dto: any) {
    return this.profileService.addSkill(profileId, dto);
  }

  @Delete('skills/:id')
  @ApiBearerAuth()
  removeSkill(@Param('id') id: string) {
    return this.profileService.removeSkill(id);
  }
}
