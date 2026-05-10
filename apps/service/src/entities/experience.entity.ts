import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
export { EmploymentType } from '@profilehub/data-access';
export type { IExperience } from '@profilehub/data-access';
import { EmploymentType, IExperience } from '@profilehub/data-access';

@Entity('experiences')
export class ExperienceEntity implements IExperience {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  profileId!: string;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'varchar', length: 150 })
  company!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location!: string | null;

  @Column({ type: 'varchar', length: 20, default: EmploymentType.FULL_TIME })
  employmentType!: EmploymentType;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({ type: 'text', default: '' })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => ProfileEntity, (p) => p.experiences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile?: ProfileEntity;
}
