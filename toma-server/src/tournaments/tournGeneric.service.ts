import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validateDefined } from "../utilFunctions/validateDefined.util";
import { Tournament } from "./entities/tournament.entity";
import { MemberVariants } from "./types/memberTables.enum";

@Injectable()
export class TournGenericService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}
  public async getTournamentWithMembers({
    memberTableString,
    tournId,
  }: {
    memberTableString: MemberVariants;
    tournId: number;
  }) {
    const tournament = await this.tournamentRepository.findOne(
      { id: tournId },
      { relations: [memberTableString] },
    );
    validateDefined(tournament, "Cannot find a valid tournament");
    return tournament;
  }
  public async getTournament(tournId: number) {
    const tournament = await this.tournamentRepository.findOne(tournId);
    validateDefined(tournament, "Cannot find a valid tournament");
    return tournament;
  }
  public async incrementTournamentRound(tournId: number) {
    const tournament = await this.getTournament(tournId);
    tournament.currentRound++;
    await this.tournamentRepository.save(tournament);
  }
}
