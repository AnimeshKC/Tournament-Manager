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
export class SingleElimMember {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tournId: number;
  @ManyToOne(_ => Tournament, { nullable: false })
  @JoinColumn({ name: "tournId" })
  tourn: Tournament;

  @Column({ type: "text" })
  participantName: string;
  @Column()
  userId: number;
  @ManyToOne(
    () => User,
    user => user.singleElimEntries,
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "integer", default: 0 })
  roundEliminated: number;
  @Column({ type: "integer", default: 0 })
  seedValue: number;
}
