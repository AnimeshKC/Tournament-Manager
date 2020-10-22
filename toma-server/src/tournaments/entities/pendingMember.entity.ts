import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Tournament } from "./tournament.entity";

@Entity()
export class PendingMember {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "integer", nullable: false })
  userId: number;
  @ManyToOne(
    () => User,
    user => user.pendingEntries,
    { nullable: false, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "integer", nullable: false })
  tournId: number;

  @ManyToOne(
    () => Tournament,
    tournament => tournament.pendingMembers,
    { nullable: false, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "tournId" })
  tourn: Tournament;
}
