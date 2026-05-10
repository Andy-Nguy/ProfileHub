import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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

  @Column({ type: 'uuid' })
  profileId!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 20, default: SkillCategory.OTHER })
  category!: SkillCategory;

  @Column({ type: 'int', default: 0 })
  endorsementCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => ProfileEntity, (p) => p.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile?: ProfileEntity;
}
