import { SingleElimMember } from "../../tournaments/entities/singleElimMember.entity";
import { Tournament } from "../../tournaments/entities/tournament.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

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

  @OneToMany(
    () => SingleElimMember,
    entry => entry.user,
  )
  singleElimEntries: SingleElimMember[];

  @OneToMany(
    () => Tournament,
    tournament => tournament.user,
  )
  tournaments: Tournament[];
}
