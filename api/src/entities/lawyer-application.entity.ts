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
import { Partner } from './partner.entity';

@Entity('lawyer_applications')
export class LawyerApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  partnerId: string;

  @ManyToOne(() => Partner)
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ nullable: true })
  proofOfLicenseUrl: string;

  @Column({ nullable: true })
  insuranceProofUrl: string;

  @Column({ nullable: true })
  identificationUrl: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  verifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'boolean', default: false })
  termsAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
