import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Media } from './media.entity';
import { ServiceOffering } from './service_offerings.entity';
import { PlatformFee } from './platform_fee.entity';

export enum VerificationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

@Entity('specialists')
export class Specialist {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal')
  base_price!: number;

  // ✅ NUMERIC VALUE
  @Column('decimal', { default: 0 })
  platform_fee_amount!: number;

  @Column('decimal')
  final_price!: number;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.pending,
  })
  verification_status!: VerificationStatus;

  @Column({ default: false })
  is_verified!: boolean;

  @Column({ default: true })
  is_draft!: boolean;

  @Column('int', { nullable: true })
  duration_days?: number;

  @Column('decimal', { default: 0 })
  average_rating!: number;

  @Column('int', { default: 0 })
  total_number_of_ratings!: number;

  // ✅ RELATIONS
  @OneToMany(() => Media, media => media.specialist, { cascade: true })
  media!: Media[];

  @OneToMany(() => ServiceOffering, so => so.specialist, { cascade: true })
  service_offerings!: ServiceOffering[];

  @OneToOne(() => PlatformFee, pf => pf.specialist, { cascade: true })
  @JoinColumn()
  platform_fee?: PlatformFee;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
