import { FileVisibility } from "@/lib/types/file";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity"; // normalan import

enum FileStatus {
  UPLOADING = "UPLOADING",
  PROCESSING = "PROCESSING",
  READY = "READY",
  FAILED = "FAILED",
}

@Entity("files")
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  originalName: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimeType: string;

  @Column({default: ""})
  thumbnail: string;

  @Column("bigint")
  size: number;

  @Column({
    type: "enum",
    enum: FileVisibility,
    default: FileVisibility.PRIVATE,
  })
  visibility: FileVisibility;

  @Column({default: "00:00:00"})
  duration: string;

  @Column()
  status: FileStatus;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
