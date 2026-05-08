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

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  userId!: string;

  @Column({ type: 'varchar', length: 100 })
  displayName!: string;

  @Column({ type: 'varchar', length: 200, default: '' })
  headline!: string;

  @Column({ type: 'text', default: '' })
  bio!: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  location!: string | null;

  @Column({ type: 'boolean', default: true })
  isPublic!: boolean;

  @Column({ type: 'int', default: 0 })
  likesCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => UserEntity, (u) => u.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @OneToMany(() => SkillEntity, (s) => s.profile, { cascade: true })
  skills?: SkillEntity[];

  @OneToMany(() => ExperienceEntity, (e) => e.profile, { cascade: true })
  experiences?: ExperienceEntity[];

  @OneToMany(() => EducationEntity, (e) => e.profile, { cascade: true })
  educations?: EducationEntity[];
}
