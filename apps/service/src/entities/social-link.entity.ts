import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('social_links')
@Unique(['profileId', 'platform'])
export class SocialLinkEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'profile_id', type: 'uuid' })
  profileId!: string;

  @Column({ type: 'varchar', length: 50 })
  platform!: string; // e.g., 'github', 'linkedin', 'website', 'twitter'

  @Column({ type: 'varchar', length: 2048 })
  url!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => ProfileEntity, (p) => p.socialLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile?: ProfileEntity;
}
