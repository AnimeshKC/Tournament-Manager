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
  async acceptPendingUser(acceptData: {
    managerId: number;
    tournId: number;
    pendingUserId: number;
  }) {
    const { tournId, managerId, pendingUserId } = acceptData;
    try {
      //check for ownership
      const tournament = await this.tournamentRepository.findOne({
        id: tournId,
        userId: managerId,
      });
      if (!tournament)
        throw new HttpException(
          "This manager does not own the requested tournament",
          HttpStatus.NOT_FOUND,
        );
      const pendingObject = {
        tournId,
        userId: pendingUserId,
      };

      const pendingInstance = await this.pendingRepository.findOne(
        pendingObject,
      );
      if (!pendingInstance)
        throw new HttpException(
          "The requested user is not pending for the requested tournament",
          HttpStatus.NOT_FOUND,
        );
      if (pendingInstance.tournId !== managerId)
        throw new HttpException(
          "The manager does not own the requested tournament",
          HttpStatus.UNAUTHORIZED,
        );
      const deletePromise = this.pendingRepository.delete(pendingObject);
      const tournamentType = pendingInstance.tourn.tournamentType;

      //TODO: parallelize deletePromise and createPromise
      //TODO: Use addUserToPending to place the user
    } catch (err) {
      throw err;
    }
  }
}
