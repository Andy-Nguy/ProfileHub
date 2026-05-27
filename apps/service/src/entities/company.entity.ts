import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICompany } from '@profilehub/types';
import { ExperienceEntity } from './experience.entity';

export { ICompany } from '@profilehub/types';

@Entity('companies')
export class CompanyEntity implements ICompany {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  domain!: string | null;

  @Column({ name: 'logo_url', type: 'varchar', length: 2048, nullable: true })
  logoUrl!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => ExperienceEntity, (experience) => experience.companyDetails)
  experiences?: ExperienceEntity[];
}
