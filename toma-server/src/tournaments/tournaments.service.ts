import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import CreateTournamentDTO from "./dto/createTournament.dto";
import { PendingMember } from "./entities/pendingMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { SingleEliminationService } from "./singleElimination.service";
import { TournamentVariants } from "./types/tournamentVariants.enum";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(PendingMember)
    private pendingRepository: Repository<PendingMember>,
    private singleElimService: SingleEliminationService,
  ) {}
  async createTournament(
    creationData: CreateTournamentDTO,
  ): Promise<Tournament> {
    const newTournament = this.tournamentRepository.create(creationData);
    await this.tournamentRepository.save(newTournament);
    return newTournament;
  }
  //TODO: Make this generic so that it can process both participant names and userids
  async addParticipantToTournament(participantData: {
    tournamentType: TournamentVariants;
    participantName?: string;
    userId?: number;
    tournId: number;
  }) {
    const { tournamentType, ...singleElimData } = participantData;
    if (participantData.tournamentType === "Single Elimination") {
      return this.singleElimService.addParticipant(singleElimData);
    }
  }
  async addUserToPending(pendingData: { userId: number; tournId: number }) {
    const pendingUser = this.pendingRepository.create(pendingData);
    await this.pendingRepository.save(pendingUser);
    return pendingUser;
  }
  private async obtainPendingInstance(tournId: number, userId: number) {
    const pendingInstance = await this.pendingRepository.findOne({
      tournId,
      userId,
    });
    if (!pendingInstance)
      throw new HttpException(
        "The requested user is not pending for the requested tournament",
        HttpStatus.NOT_FOUND,
      );
    return pendingInstance;
  }

  private async obtainTournamentByUser(tournId: number, userId: number) {
    const tournament = await this.tournamentRepository.findOne({
      id: tournId,
      userId,
    });
    if (!tournament)
      throw new HttpException(
        "User and Tournament combination do not match",
        HttpStatus.NOT_FOUND,
      );
    return tournament;
  }
  //TODO: Extract pending repository logic to another service
  async acceptPendingUser(acceptData: {
    managerId: number;
    tournId: number;
    pendingUserId: number;
  }) {
    const { tournId, managerId, pendingUserId: userId } = acceptData;

    const pendingInstance = await this.obtainPendingInstance(tournId, userId);
    const tournament = await this.obtainTournamentByUser(tournId, managerId);

    const tournamentType = tournament.tournamentType;

    //TODO: convert this logic to a transaction
    const addParticipantPromise = this.addParticipantToTournament({
      tournamentType,
      userId,
      tournId,
    });
    const deleteFromPendingPromise = this.pendingRepository.delete(
      pendingInstance.id,
    );
    await Promise.all([deleteFromPendingPromise, addParticipantPromise]);
    return {
      status: "User Added",
      userId,
      tournId,
    };
  }
}
