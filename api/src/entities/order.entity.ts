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
import { Referral } from './referral.entity';

export enum OrderType {
  SUBSCRIPTION = 'subscription',
  TEMPLATE = 'template',
  REFERRAL = 'referral',
  ADD_ON = 'add_on',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  @Index()
  lawyerId: string;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'lawyerId' })
  lawyer: Partner;

  @Column({ nullable: true })
  @Index()
  referralId: string;

  @ManyToOne(() => Referral)
  @JoinColumn({ name: 'referralId' })
  referral: Referral;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  @Index()
  type: OrderType;

  @Column({ type: 'integer' })
  amountGrossCents: number;

  @Column({ type: 'varchar', length: 10, default: 'eur' })
  currency: string;

  @Column({ type: 'integer', default: 0 })
  platformFeeFixedCents: number;

  @Column({ type: 'integer', default: 0 })
  platformFeePercentCents: number;

  @Column({ type: 'integer', default: 0 })
  amountPlatformCents: number;

  @Column({ type: 'integer', default: 0 })
  amountLawyerCents: number;

  @Column({ nullable: true })
  @Index()
  stripeInvoiceId: string;

  @Column({ nullable: true })
  @Index()
  stripePaymentIntentId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
