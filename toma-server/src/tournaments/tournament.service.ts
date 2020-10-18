import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import CreateTournamentDto from "./dto/createTournament.dto";
import { Tournament } from "./entities/tournament.entity";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
  ) {}
  async createTournament(
    creationData: CreateTournamentDto,
  ): Promise<Tournament> {
    const newTournament = this.tournamentRepository.create(creationData);
    await this.tournamentRepository.save(newTournament);
    return newTournament;
  }
}
