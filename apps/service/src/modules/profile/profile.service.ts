import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserEntity } from '../../entities/user.entity';
import { ExperienceEntity } from '../../entities/experience.entity';
import { EducationEntity } from '../../entities/education.entity';
import { SkillEntity } from '../../entities/skill.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity) private readonly profileRepo: Repository<ProfileEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ExperienceEntity) private readonly expRepo: Repository<ExperienceEntity>,
    @InjectRepository(EducationEntity) private readonly eduRepo: Repository<EducationEntity>,
    @InjectRepository(SkillEntity) private readonly skillRepo: Repository<SkillEntity>,
  ) {}

  // ── Profile CRUD ──────────────────────

  async findByUsername(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new NotFoundException(`User @${username} not found`);

    const profile = await this.profileRepo.findOne({
      where: { userId: user.id },
      relations: ['skills', 'experiences', 'educations'],
    });
    if (!profile) throw new NotFoundException('Profile not found');

    return { ...profile, username: user.username };
  }

  async create(userId: string, dto: { displayName: string }) {
    const exists = await this.profileRepo.findOne({ where: { userId } });
    if (exists) throw new ConflictException('Profile already exists');

    const profile = this.profileRepo.create({ ...dto, userId });
    return this.profileRepo.save(profile);
  }

  async update(id: string, dto: Partial<{ displayName: string; headline: string; avatarUrl: string }>) {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  async toggleVisibility(id: string) {
    const profile = await this.profileRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    // Toggle between public and private
    profile.visibility = profile.visibility === 'public' ? 'private' as any : 'public' as any;
    return this.profileRepo.save(profile);
  }

  // ── Experience CRUD ───────────────────

  async addExperience(profileId: string, dto: any) {
    const exp = this.expRepo.create({ ...dto, profileId });
    return this.expRepo.save(exp);
  }

  async removeExperience(id: string) {
    const exp = await this.expRepo.findOne({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    return this.expRepo.remove(exp);
  }

  // ── Education CRUD ────────────────────

  async addEducation(profileId: string, dto: any) {
    const edu = this.eduRepo.create({ ...dto, profileId });
    return this.eduRepo.save(edu);
  }

  async removeEducation(id: string) {
    const edu = await this.eduRepo.findOne({ where: { id } });
    if (!edu) throw new NotFoundException('Education not found');
    return this.eduRepo.remove(edu);
  }

  // ── Skills CRUD ───────────────────────

  async addSkill(profileId: string, dto: any) {
    const skill = this.skillRepo.create({ ...dto, profileId });
    return this.skillRepo.save(skill);
  }

  async removeSkill(id: string) {
    const skill = await this.skillRepo.findOne({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return this.skillRepo.remove(skill);
  }

  // ── Discovery Feed ────────────────────

  async getDiscoveryFeed(page = 1, limit = 20, search?: string) {
    const qb = this.profileRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.skills', 's')
      .where('p.visibility = :vis', { vis: 'public' });

    if (search) {
      qb.andWhere(
        '(p.display_name ILIKE :q OR p.headline ILIKE :q OR u.username ILIKE :q)',
        { q: `%${search}%` },
      );
    }

    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

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
}
