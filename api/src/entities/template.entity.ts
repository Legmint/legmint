import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AccessLevel {
  STARTER = 'starter',
  PRO = 'pro',
  SCALE = 'scale',
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  templateCode: string;

  @Column()
  name: string;

  @Column()
  pack: string;

  @Column()
  version: string;

  @Column('simple-array')
  supportedJurisdictions: string[];

  @Column({
    type: 'enum',
    enum: AccessLevel,
  })
  accessLevel: AccessLevel;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  // Template content (JSON structure)
  @Column({ type: 'jsonb' })
  clauses: any[];

  @Column({ type: 'jsonb' })
  variablesSchema: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Overlays for different jurisdictions
  @Column({ type: 'jsonb', nullable: true })
  overlays: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  publishedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;
}
