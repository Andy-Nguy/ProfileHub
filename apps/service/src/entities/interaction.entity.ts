import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { InteractionTargetType, InteractionType } from '../../../../libs/shared/types/types';

@Entity('interactions')
@Index(['userId', 'targetType', 'targetId', 'interactionType'], { unique: true })
export class InteractionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 20 })
  targetType!: InteractionTargetType;

  @Column({ type: 'uuid' })
  targetId!: string;

  @Column({ type: 'varchar', length: 20 })
  interactionType!: InteractionType;

  @CreateDateColumn()
  createdAt!: Date;
}
