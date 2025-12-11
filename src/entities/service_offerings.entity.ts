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

@Entity("service_offerings")
export class ServiceOffering {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  specialists!: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.service_offerings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "specialists" })
  specialist!: Specialist;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
