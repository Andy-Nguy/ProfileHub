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
import { UserEntity } from './user.entity';
import { SkillEntity } from './skill.entity';
import { ExperienceEntity } from './experience.entity';
import { EducationEntity } from './education.entity';
import { VisibilityType, IProfile } from '../../../../libs/shared/types/types';

export { VisibilityType, IProfile } from '../../../../libs/shared/types/types';

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

  @Column({ name: 'avatar_url', type: 'varchar', length: 2048, nullable: true })
  avatarUrl!: string | null;

  @Column({
    type: 'enum',
    enum: VisibilityType,
    default: VisibilityType.PUBLIC,
  })
  visibility!: VisibilityType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  // ── Relations ─────────────────────────────────────────────────────────
  @OneToOne(() => UserEntity, (u) => u.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => SkillEntity, (s) => s.profile, { cascade: true })
  skills?: SkillEntity[];

  @OneToMany(() => ExperienceEntity, (e) => e.profile, { cascade: true })
  experiences?: ExperienceEntity[];

  @OneToMany(() => EducationEntity, (e) => e.profile, { cascade: true })
  educations?: EducationEntity[];
}
