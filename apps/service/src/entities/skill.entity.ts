import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
export { SkillCategory } from '@profilehub/data-access';
export type { ISkill } from '@profilehub/data-access';
import { SkillCategory, ISkill } from '@profilehub/data-access';

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
