import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Media } from "./media.entity";
import { PlatformFee } from "./platform_fee.entity";
import { ServiceOffering } from "./service_offerings.entity";

export enum VerificationStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected"
}

@Entity("specialists")
export class Specialist {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 3, scale: 2, nullable: true })
  average_rating: number;

  @Column({ type: "boolean", default: true })
  is_draft: boolean;

  @Column("int", { default: 0 })
  total_number_of_ratings: number;

  @Column("varchar", { length: 255 })
  title: string;

  @Column("varchar", { length: 255 })
  slug: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  base_price: number;

  @Column("decimal", { precision: 10, scale: 2 })
  platform_fee: number;

  @Column("decimal", { precision: 10, scale: 2 })
  final_price: number;

  @Column({
    type: "enum",
    enum: VerificationStatus,
    default: VerificationStatus.pending,
  })
  verification_status: VerificationStatus;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @Column("int", { nullable: true })
  duration_days: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // ---- RELATIONS ----

  @OneToMany(() => Media, (media) => media.specialist)
  media: Media[];

  @OneToMany(() => PlatformFee, (fee) => fee.specialist)
  platform_fees: PlatformFee[];

  @OneToMany(() => ServiceOffering, (service) => service.specialist)
  service_offerings: ServiceOffering[];
}
