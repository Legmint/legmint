import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Referral } from './referral.entity';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  jurisdiction: string;

  @Column('simple-array')
  specializations: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: 20 })
  discountPercentage: number;

  @Column({ default: 15 })
  commissionPercentage: number;

  @Column({ default: true })
  isActive: boolean;

  // Lawyer onboarding fields
  @Column({ nullable: true })
  stripeAccountId: string;

  @Column({ type: 'varchar', length: 50, default: 'disconnected' })
  stripeStatus: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'active', 'suspended', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column('simple-array', { nullable: true })
  languages: string[];

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  userId: string;

  // Pricing
  @Column({ type: 'integer', nullable: true })
  priceFixedCents: number;

  @Column({ type: 'integer', nullable: true })
  priceHourlyCents: number;

  // Verification
  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  verifiedBy: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => Referral, (referral) => referral.partner)
  referrals: Referral[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
