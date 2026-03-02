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

  @Column("bigint")
  size: number;

  @Column({
    type: "enum",
    enum: FileVisibility,
    default: FileVisibility.PRIVATE,
  })
  visibility: FileVisibility;

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
