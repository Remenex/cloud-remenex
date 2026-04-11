import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: "FREE" })
  plan: "FREE" | "CREATOR" | "PRO";

  @Column({default: 0})
  bandwidthUsed: number;  

  @Column({ type: "timestamp", nullable: true })
  emailVerified?: Date;

  @Column({ type: "varchar", length: 10, nullable: true })
  otpCode?: string;

  @Column({ type: "timestamp", nullable: true })
  otpExpires?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
