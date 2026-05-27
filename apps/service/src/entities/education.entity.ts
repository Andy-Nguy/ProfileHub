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
import { IEducation } from '@profilehub/types';

export { IEducation } from '@profilehub/types';

@Entity('educations')
export class EducationEntity implements IEducation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'profile_id', type: 'uuid' })
  profileId!: string;

  @Column({ name: 'institution_name', type: 'varchar', length: 255 })
  institution!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  degree!: string | null;

  @Column({ name: 'field_of_study', type: 'varchar', length: 255, nullable: true })
  fieldOfStudy!: string | null;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ name: 'is_current', type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({ name: 'institution_logo_url', type: 'varchar', length: 2048, nullable: true })
  institutionLogoUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'display_order', type: 'smallint', default: 0 })
  displayOrder!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => ProfileEntity, (p) => p.educations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile?: ProfileEntity;
}
