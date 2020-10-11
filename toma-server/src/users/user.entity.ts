import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false, length: 64, unique: true })
  username: string;
  @Column({ type: "varchar", nullable: false, length: 255, unique: true })
  email: string;
  @Column({ type: "varchar", nullable: false, length: 255 })
  password: string;
}
