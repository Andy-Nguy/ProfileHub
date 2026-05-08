import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { SkillCategory } from '../../../../libs/shared/data-access/src';

@Entity('skills')
export class SkillEntity {
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
