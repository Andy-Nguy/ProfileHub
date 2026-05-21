import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SkillEntity } from './skill.entity';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { SocialLinkEntity } from './social-link.entity';
import { VisibilityTypeEnum, IProfile } from '@profilehub/types';

export { VisibilityTypeEnum, IProfile } from '@profilehub/types';

@Entity('profiles')
export class ProfileEntity implements IProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId!: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName!: string;

  @Column({ type: 'varchar', length: 220, nullable: true })
  headline!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 2048, nullable: true })
  avatarUrl!: string | null;

  @Column({ name: 'cover_url', type: 'varchar', length: 2048, nullable: true })
  coverUrl!: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  industry!: string | null;

  @Column({
    type: 'enum',
    enum: VisibilityTypeEnum,
    default: VisibilityTypeEnum.PUBLIC,
  })
  visibility!: VisibilityTypeEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  // ── Relations ─────────────────────────────────────────────────────────
  @OneToOne(() => User, (u) => u.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => SkillEntity, (s) => s.profile, { cascade: true })
  skills?: SkillEntity[];

  @OneToMany(() => ExperienceEntity, (e) => e.profile, { cascade: true })
  experiences?: ExperienceEntity[];

  @OneToMany(() => EducationEntity, (e) => e.profile, { cascade: true })
  educations?: EducationEntity[];

  @OneToMany(() => SocialLinkEntity, (s) => s.profile, { cascade: true })
  socialLinks?: SocialLinkEntity[];
}
