import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";
import { Specialist } from "./specialists.entity";

export enum MimeType {
  jpeg = "jpeg",
  png = "png",
  webp = "webp",
  mp4 = "mp4"
}

export enum MediaType {
  image = "image",
  video = "video"
}

@Entity("media")
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  specialists: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.media, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "specialists" })
  specialist: Specialist;

  @Column("varchar", { length: 255 })
  file_name: string;

  @Column("int")
  file_size: number;

  @Column("int")
  display_order: number;

  @Column({
    type: "enum",
    enum: MimeType,
    nullable: true,
  })
  mime_type: MimeType;

  @Column({
    type: "enum",
    enum: MediaType,
    nullable: true,
  })
  media_type: MediaType;

  @Column({ type: "timestamp", nullable: true })
  uploaded_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
