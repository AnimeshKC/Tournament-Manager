import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false, length: 64, unique: true })
  username: string;
  @Column({ type: "varchar", nullable: false, length: 128, unique: true })
  email: string;
  @Column({ type: "text", nullable: false })
  password: string;
}
