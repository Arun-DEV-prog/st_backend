import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Specialist } from "./specialists.entity";

export enum TierName {
  basic = "basic",
  standard = "standard",
  premium = "premium"
}

@Entity("platform_fee")
export class PlatformFee {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: TierName,
  })
  tier_name!: TierName;

  @Column("int")
  min_value!: number;

  @Column("int")
  max_value!: number;

  @Column("decimal", { precision: 5, scale: 2 })
  platform_fee_percentage!: number;

  @Column("uuid")
  specialists!: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.platform_fees, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "specialists" })
  specialist!: Specialist;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
