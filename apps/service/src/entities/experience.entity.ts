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
export { EmploymentType, IExperience } from '@profilehub/types';
import { EmploymentType, IExperience } from '@profilehub/types';

@Entity('experiences')
export class ExperienceEntity implements IExperience {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'profile_id', type: 'uuid' })
  profileId!: string;

  @Column({ name: 'job_title', type: 'varchar', length: 255 })
  title!: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255 })
  company!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location!: string | null;

  @Column({
    name: 'employment_type',
    type: 'varchar',
    length: 20,
    default: EmploymentType.FULL_TIME,
  })
  employmentType!: EmploymentType;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ name: 'is_current', type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'display_order', type: 'smallint', default: 0 })
  displayOrder!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => ProfileEntity, (p) => p.experiences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile?: ProfileEntity;
}
