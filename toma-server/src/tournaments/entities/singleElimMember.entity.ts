import { User } from "../../users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  Unique,
} from "typeorm";
import { Tournament } from "./tournament.entity";

@Entity()
@Check(`"participantName" IS NOT NULL OR "userId" IS NOT NULL`)
@Unique("Unique Participant name per tournament", ["tourn", "participantName"])
export class SingleElimMember {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(_ => Tournament, { nullable: false })
  tourn: Tournament;

  @Column({ type: "text" })
  participantName: string;
  @ManyToOne(_ => User)
  user: User;
  @Column({ type: "integer", default: 0 })
  roundEliminated: number;
  @Column({ type: "integer", default: 0 })
  seedValue: number;
}
