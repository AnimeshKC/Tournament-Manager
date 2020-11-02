import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
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
  @Transactional({ propagation: Propagation.SUPPORTS })
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
  private async obtainPendingInstance(userId: number, tournId: number) {
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

  private async joinPendingAndTourn(userId: number, tournId: number) {
    const pendingTournInstance = await this.pendingRepository.findOne(
      { tournId, userId },
      { relations: ["tourn"] },
    );
    if (!pendingTournInstance?.tourn) {
      throw new HttpException(
        "The requested pending user cannot be found",
        HttpStatus.NOT_FOUND,
      );
    }
    return pendingTournInstance;
  }

  private checkId(userId: number, realId: number) {
    if (userId !== realId)
      throw new HttpException(
        "Authenticated User does not permitted user for this request",
        HttpStatus.NOT_FOUND,
      );
  }
  @Transactional()
  private async deletePending_addUser_transaction(
    pendingInstanceId: number,
    userId: number,
    tournId: number,
    tournamentType: TournamentVariants,
  ) {
    await Promise.all([
      this.pendingRepository.delete(pendingInstanceId),
      this.addParticipantToTournament({
        tournamentType,
        userId,
        tournId,
      }),
    ]);
  }
  //TODO: Extract pending repository logic to another service
  //TODO: send message to user that the tournament was accepted
  async acceptPendingUser(acceptData: {
    managerId: number;
    tournId: number;
    pendingUserId: number;
  }) {
    const { tournId, managerId, pendingUserId: userId } = acceptData;

    const pendingInstance = await this.joinPendingAndTourn(userId, tournId);

    const tournamentType = pendingInstance.tourn.tournamentType;
    const realManagerId = pendingInstance.tourn.userId;
    this.checkId(managerId, realManagerId);

    await this.deletePending_addUser_transaction(
      pendingInstance.id,
      userId,
      tournId,
      tournamentType,
    );
    return {
      status: "User Added",
      userId,
      tournId,
    };
  }
  //TODO: send a message to the user that the user has been removed
  async rejectPendingUser(userId: number, tournId: number) {
    const pendingInstance = await this.obtainPendingInstance(userId, tournId);
    await this.pendingRepository.delete(pendingInstance.id);
    return "Success";
  }
}
