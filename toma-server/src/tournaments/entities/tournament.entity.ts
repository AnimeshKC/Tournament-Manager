import { User } from "../../users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { TournamentAccess } from "../types/tournamentAccess.enum";
import { TournamentStatus } from "../types/tournamentStatus.enum";
import { TournamentVariants } from "../types/tournamentVariants.enum";
import { SingleElimMember } from "./singleElimMember.entity";
import { PendingMember } from "./pendingMember.entity";

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "text", nullable: false })
  name: string;

  @Column()
  userId: number;
  @ManyToOne(
    () => User,
    user => user.tournaments,
    { nullable: false },
  )
  @JoinColumn({ name: "userId" })
  user: User;
  @OneToMany(
    () => SingleElimMember,
    singleElim => singleElim.tourn,
  )
  singleElimMembers: SingleElimMember[];
  @OneToMany(
    () => PendingMember,
    pending => pending.tourn,
  )
  pendingMembers: PendingMember[];
  @Column({
    type: "enum",
    enum: TournamentVariants,
    default: TournamentVariants.SINGLE_ELIM,
  })
  tournamentType: TournamentVariants;
  @Column({
    type: "enum",
    enum: TournamentStatus,
    default: TournamentStatus.pending,
  })
  tournamentStatus: TournamentStatus;
  @Column({
    type: "enum",
    enum: TournamentAccess,
    default: TournamentAccess.public,
  })
  tournamentAccess: TournamentAccess;
  @Column({ type: "boolean", default: true })
  joinable: boolean;
  @Column({ type: "integer", default: 0 })
  currentRound: number;
}
