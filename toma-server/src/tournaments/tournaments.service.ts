import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import AddPartipantDTO from "./dto/addParticipant.dto";
import CreateTournamentDTO from "./dto/createTournament.dto";
import { Tournament } from "./entities/tournament.entity";
import { SingleEliminationService } from "./singleElimination.service";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    private singleElimService: SingleEliminationService,
  ) {}
  async createTournament(
    creationData: CreateTournamentDTO,
  ): Promise<Tournament> {
    const newTournament = this.tournamentRepository.create(creationData);
    await this.tournamentRepository.save(newTournament);
    return newTournament;
  }
  async addParticipantToTournament(participantData: AddPartipantDTO) {
    if (participantData.tournamentType === "Single Elimination") {
      return this.singleElimService.addParticipantName(
        participantData.tournId,
        participantData.participantName,
      );
    }
  }
}
