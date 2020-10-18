import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import AddPartipantDto from "./dto/addParticipant.dto";
import CreateTournamentDto from "./dto/createTournament.dto";
import { SingleElimMember } from "./entities/singleElimMember.entity";
import { Tournament } from "./entities/tournament.entity";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(SingleElimMember)
    private singleElimRepository: Repository<SingleElimMember>,
  ) {}
  async createTournament(
    creationData: CreateTournamentDto,
  ): Promise<Tournament> {
    const newTournament = this.tournamentRepository.create(creationData);
    await this.tournamentRepository.save(newTournament);
    return newTournament;
  }
  async addParticipantToTournament(participantData: AddPartipantDto) {
    if (participantData.type === "Single Elimination") {
    }
  }
}
