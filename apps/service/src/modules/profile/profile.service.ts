import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienceEntity } from '../../entities/experience.entity';
import { EducationEntity } from '../../entities/education.entity';
import { SkillEntity } from '../../entities/skill.entity';
import { ProfileEntity } from '../../entities/profile.entity';
import { VisibilityType } from '../../entities';
import { ProfileRepository } from './profile.repository';
import { UsersRepository } from '../user/repositories/users.repository';
import { OnboardingProfileDto, UpdateOnboardingDto } from './dto';

export interface OnboardingStatus {
  needsOnboarding: boolean;
  profileCompletion: number;
  profile: OnboardingProfileDto | null;
}

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly usersRepository: UsersRepository,
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    @InjectRepository(ExperienceEntity)
    private readonly expRepo: Repository<ExperienceEntity>,
    @InjectRepository(EducationEntity)
    private readonly eduRepo: Repository<EducationEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepo: Repository<SkillEntity>,
  ) {}

  // ── Profile CRUD ──────────────────────

  async findByUsername(username: string) {
    const profile = await this.profileRepository.findPublicProfileByUsername(username);
    if (!profile) throw new NotFoundException('Profile not found');

    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      headline: profile.headline,
      avatarUrl: profile.avatarUrl,
      visibility: profile.visibility,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      skills: profile.skills,
      experiences: profile.experiences,
      educations: profile.educations,
      username: profile.user?.username,
    };
  }

  // ── Discovery Feed ────────────────────

  async getDiscoveryFeed(page = 1, limit = 20, search?: string) {
    const [items, total] = await this.profileRepository.findDiscoverableProfiles(
      page,
      limit,
      search,
    );

    return {
      data: items.map((p) => ({
        id: p.id,
        username: p.user?.username,
        displayName: p.displayName,
        headline: p.headline,
        avatarUrl: p.avatarUrl,
        skills: (p.skills ?? []).map((s) => s.name),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    dto: Partial<{ displayName: string; headline: string; avatarUrl: string }>,
  ) {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  async toggleVisibility(id: string) {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    profile.visibility =
      profile.visibility === 'public'
        ? ('private' as VisibilityType)
        : ('public' as VisibilityType);
    return this.profileRepo.save(profile);
  }

  async addExperience(profileId: string, dto: any) {
    const exp = this.expRepo.create({ ...dto, profileId });
    return this.expRepo.save(exp);
  }

  async removeExperience(id: string) {
    const exp = await this.expRepo.findOne({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    return this.expRepo.remove(exp);
  }

  async addEducation(profileId: string, dto: any) {
    const edu = this.eduRepo.create({ ...dto, profileId });
    return this.eduRepo.save(edu);
  }

  async removeEducation(id: string) {
    const edu = await this.eduRepo.findOne({ where: { id } });
    if (!edu) throw new NotFoundException('Education not found');
    return this.eduRepo.remove(edu);
  }

  async addSkill(profileId: string, dto: any) {
    const skill = this.skillRepo.create({ ...dto, profileId });
    return this.skillRepo.save(skill);
  }

  async removeSkill(id: string) {
    const skill = await this.skillRepo.findOne({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return this.skillRepo.remove(skill);
  }

  async getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
    const user = await this.usersRepository.findActiveUserById(userId);
    if (!user || user.deletedAt !== null || !user.isActive) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findByUserIdOrFail(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const profileCompletion = this.calculateProfileCompletion(profile);

    return {
      needsOnboarding: profileCompletion < 70,
      profileCompletion,
      profile: this.toOnboardingProfileDto(profile),
    };
  }

  async updateOnboardingProfile(
    userId: string,
    dto: UpdateOnboardingDto,
  ): Promise<OnboardingStatus> {
    const user = await this.usersRepository.findActiveUserById(userId);
    if (!user || user.deletedAt !== null || !user.isActive) {
      throw new NotFoundException('User not found');
    }

    const existingProfile = await this.profileRepository.findByUserIdOrFail(userId);
    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    const updatedProfile = await this.profileRepository.saveOnboardingProfile(existingProfile, dto);
    const profileCompletion = this.calculateProfileCompletion(updatedProfile);

    return {
      needsOnboarding: profileCompletion < 70,
      profileCompletion,
      profile: this.toOnboardingProfileDto(updatedProfile),
    };
  }

  private calculateProfileCompletion(profile: OnboardingProfileDto): number {
    let completion = 0;

    if (profile.displayName.trim().length > 0) {
      completion += 40;
    }

    if (profile.headline && profile.headline.trim().length > 0) {
      completion += 30;
    }

    if (profile.avatarUrl && profile.avatarUrl.trim().length > 0) {
      completion += 30;
    }

    return completion;
  }

  private toOnboardingProfileDto(profile: {
    id: string;
    displayName: string;
    headline: string | null;
    avatarUrl: string | null;
    visibility: VisibilityType;
  }): OnboardingProfileDto {
    return {
      id: profile.id,
      displayName: profile.displayName,
      headline: profile.headline,
      avatarUrl: profile.avatarUrl,
      visibility: profile.visibility,
    };
  }
}
