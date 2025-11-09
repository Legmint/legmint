import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Partner } from './partner.entity';

export enum ReferralStatus {
  CREATED = 'created',
  CLICKED = 'clicked',
  BOOKED = 'booked',
  EXPIRED = 'expired',
  REQUESTED = 'requested',
  PAID = 'paid',
  ASSIGNED = 'assigned',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index()
  partnerId: string;

  @ManyToOne(() => Partner, (partner) => partner.referrals)
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column({ nullable: true })
  auditLogId: string;

  @Column()
  templateCode: string;

  @Column()
  jurisdiction: string;

  @Column({ unique: true })
  @Index()
  discountToken: string;

  @Column()
  discountPercentage: number;

  @Column({
    type: 'enum',
    enum: ReferralStatus,
    default: ReferralStatus.CREATED,
  })
  status: ReferralStatus;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  clickedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  bookedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  bookingValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commissionAmount: number;

  // Payment tracking (€25 fixed + 10% model)
  @Column({ type: 'integer', default: 0 })
  amountGrossCents: number;

  @Column({ type: 'integer', default: 2500 })
  amountPlatformFixedCents: number;

  @Column({ type: 'integer', default: 0 })
  amountPlatformPercentCents: number;

  @Column({ type: 'varchar', length: 10, default: 'eur' })
  currency: string;

  @Column({ nullable: true })
  @Index()
  stripeCheckoutSessionId: string;

  @Column({ nullable: true })
  @Index()
  stripePaymentIntentId: string;

  // Document storage (S3)
  @Column({ type: 'varchar', length: 500, nullable: true })
  s3UserDocKey: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  s3LawyerReviewKey: string;

  // Workflow timestamps
  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
