import { User } from "../../users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  Unique,
  JoinColumn,
} from "typeorm";
import { Tournament } from "./tournament.entity";

@Entity()
@Check(`"participantName" IS NOT NULL OR "userId" IS NOT NULL`)
@Unique("Unique Participant name per tournament", ["tourn", "participantName"])
@Unique("Only one user per tournament", ["tourn", "userId"])
export class SingleElimMember {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tournId: number;
  @ManyToOne(
    _ => Tournament,
    tournament => tournament.singleElimMembers,
    { nullable: false, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "tournId" })
  tourn: Tournament;

  @Column({ type: "text", nullable: true })
  participantName: string;
  @Column({ type: "integer", nullable: true })
  userId: number;
  @ManyToOne(
    () => User,
    user => user.singleElimEntries,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "integer", nullable: true })
  roundEliminated: number;
  @Column({ type: "integer", default: 0 })
  seedValue: number;
}
