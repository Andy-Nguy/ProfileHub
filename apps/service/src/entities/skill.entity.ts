import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
export { SkillCategory } from '../../../../libs/shared/types/types';
export { ISkill } from '../../../../libs/shared/types/types';
import { SkillCategory, ISkill } from '../../../../libs/shared/types/types';

@Entity('skills')
export class SkillEntity implements ISkill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'profile_id', type: 'uuid' })
  profileId!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 50, default: SkillCategory.OTHER })
  category!: SkillCategory;

  @Column({ name: 'endorsement_count', type: 'int', default: 0 })
  endorsementCount!: number;

  @Column({ name: 'display_order', type: 'smallint', default: 0 })
  displayOrder!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => ProfileEntity, (p) => p.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile?: ProfileEntity;
}
