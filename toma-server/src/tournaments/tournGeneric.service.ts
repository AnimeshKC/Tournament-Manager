import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tournament } from "./entities/tournament.entity";
import { MemberVariants } from "./types/memberTables.enum";

@Injectable()
export class TournGenericService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}
  public async getTournamentWithMembers({
    relationString,
    tournId,
  }: {
    relationString: MemberVariants;
    tournId: number;
  }) {
    const tournament = await this.tournamentRepository.findOne(
      { id: tournId },
      { relations: [relationString] },
    );
    return tournament;
  }
  public async incrementTournamentRound(tournId: number) {
    const tournament = await this.tournamentRepository.findOne(tournId);
    tournament.currentRound++;
    await this.tournamentRepository.save(tournament);
  }
}
