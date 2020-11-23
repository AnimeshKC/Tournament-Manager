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

  //NOTE: member ids aren't given relationships because it's uncertain which table they relate to
  //As a result, some edge cases with deleted members must be handled when working with matches
  @Column({ nullable: false })
  member1Id: number;
  @Column({ nullable: true })
  member2Id: number;

  @Column({ type: "integer", nullable: false })
  round: number;

  @Column({ type: "integer", nullable: false })
  matchNumber: number;
}
