import { User } from "../../users/entities/user.entity";
import { Tournament } from "./tournament.entity";

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  Unique,
  JoinColumn,
} from "typeorm";

@Entity()
//a match requires at least one participant
@Check(
  `"participantName1" IS NOT NULL OR "userId1" IS NOT NULL OR "participantName2" IS NOT NULL OR "userId2" IS NOT NULL`,
)
export class Matches {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  tournId: number;
  @ManyToOne(
    _ => Tournament,
    tournament => tournament.matches,
    { nullable: false, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "tournId" })
  tourn: Tournament;

  @Column({ type: "text", nullable: true })
  participantName1: string;
  @Column({ type: "text", nullable: true })
  participantName2: string;

  @Column({ type: "integer", nullable: true })
  userId1: number;
  @ManyToOne(
    () => User,
    _ => _,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId1" })
  user1: User;

  @Column({ type: "integer", nullable: true })
  userId2: number;
  @ManyToOne(
    () => User,
    _ => _,
    { nullable: true, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId2" })
  user2: User;

  @Column({ type: "integer", nullable: false })
  round: number;

  @Column({ type: "integer", nullable: false })
  matchNumber: number;
}
