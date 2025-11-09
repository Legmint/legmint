import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Partner } from './partner.entity';

@Entity('payout_reports')
@Unique(['lawyerId', 'month'])
export class PayoutReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  lawyerId: string;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'lawyerId' })
  lawyer: Partner;

  @Column({ type: 'varchar', length: 7 })
  @Index()
  month: string; // Format: YYYY-MM

  @Column({ type: 'integer', default: 0 })
  totalReferrals: number;

  @Column({ type: 'integer', default: 0 })
  totalEarningsCents: number;

  @Column({ type: 'integer', default: 0 })
  totalPlatformFeesCents: number;

  @Column({ type: 'jsonb', nullable: true })
  referralBreakdown: {
    fixedFees: number;
    percentFees: number;
    refunds: number;
    completedCount: number;
    cancelledCount: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
