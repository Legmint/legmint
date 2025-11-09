import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { Subscription } from './subscription.entity';
import { Plan, JurisdictionCode } from './enums';

// Re-export enums for backward compatibility
export { Plan, JurisdictionCode };

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  clerkUserId: string;

  @Column({
    type: 'enum',
    enum: Plan,
    default: Plan.FREE,
  })
  plan: Plan;

  @Column('simple-array', { default: 'GLOBAL-EN' })
  jurisdictionsAllowed: string[];

  @Column({ default: 0 })
  generationCount: number;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
}
