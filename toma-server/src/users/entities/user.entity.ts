import { SingleElimMember } from "../../tournaments/entities/singleElimMember.entity";
import { Tournament } from "../../tournaments/entities/tournament.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PendingMember } from "../../tournaments/entities/pendingMember.entity";

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
    { onDelete: "SET NULL" },
  )
  singleElimEntries: SingleElimMember[];

  @OneToMany(
    () => Tournament,
    tournament => tournament.user,
    { onDelete: "CASCADE" },
  )
  tournaments: Tournament[];
  @OneToMany(
    () => PendingMember,
    pending => pending.user,
  )
  pendingEntries: PendingMember[];
}
