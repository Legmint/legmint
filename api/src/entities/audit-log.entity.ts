import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum AuditLogStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

export enum OutputFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  HTML = 'html',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index()
  templateCode: string;

  @Column()
  templateVersion: string;

  @Column()
  jurisdiction: string;

  @Column({ type: 'text' })
  inputsHash: string;

  @Column({ type: 'jsonb', nullable: true })
  inputsSummary: Record<string, any>;

  @Column({ nullable: true })
  renderTimeMs: number;

  @Column('simple-array')
  outputFormats: string[];

  @Column({
    type: 'enum',
    enum: AuditLogStatus,
  })
  status: AuditLogStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  outputUrls: Record<string, string>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @Column({ type: 'inet', nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;
}
