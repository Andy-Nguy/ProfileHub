import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('educations')
export class EducationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  profileId!: string;

  @Column({ type: 'varchar', length: 200 })
  institution!: string;

  @Column({ type: 'varchar', length: 150 })
  degree!: string;

  @Column({ type: 'varchar', length: 150 })
  fieldOfStudy!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => ProfileEntity, (p) => p.educations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile?: ProfileEntity;
}
