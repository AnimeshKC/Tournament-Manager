import { SingleElimMember } from "./singleElimMember.entity";
import { Tournament } from "./tournament.entity";

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
//a match requires at least one participant
export class singleEliminationMatches {
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

  //Allow nullable true for the sake of handling deleted users
  @Column({ nullable: true })
  member1Id: number;
  @ManyToOne(
    _ => SingleElimMember,
    _ => _,
    { nullable: true, onDelete: "SET NULL" },
  )
  @JoinColumn({ name: "member1Id" })
  member1: SingleElimMember;

  @Column({ nullable: true })
  member2Id: number;
  @ManyToOne(
    _ => SingleElimMember,
    _ => _,
    { nullable: true, onDelete: "SET NULL" },
  )
  @JoinColumn({ name: "member2Id" })
  member2: SingleElimMember;

  @Column({ type: "integer", nullable: false })
  round: number;

  @Column({ type: "integer", nullable: false })
  matchNumber: number;
}
