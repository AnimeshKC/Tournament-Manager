import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tournament } from "./tournament.entity";

@Entity()
export class SingleElimDetails {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, type: "integer" })
  tournSize: number;
  @Column({ default: false })
  isBlindSeed: boolean;
  @Column({ nullable: false, type: "integer" })
  tournId: number;
  @OneToOne(() => Tournament, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "tournId" })
  tourn: Tournament;
}
