import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { tournamentForeignKeyTweaks1602948354431 } from "src/migrations/1602948354431-tournamentForeignKeyTweaks";
import { Repository } from "typeorm";
import { SingleElimMember } from "./entities/singleElimMember.entity";

@Injectable()
export class SingleEliminationService {
  constructor(
    @InjectRepository(SingleElimMember)
    private singleElimRepository: Repository<SingleElimMember>,
  ) {}
  async addParticipantName(tournId: number, participantName: string) {
    const entry = this.singleElimRepository.create({
      participantName,
      tournId,
    });
    await this.singleElimRepository.save(entry);
    return {
      participantName: entry.participantName,
      tournId: entry.tournId,
      tournType: "Single Elimination",
    };
  }
}
