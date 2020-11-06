import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import CreateTournamentDTO from "./dto/createTournament.dto";
import { PendingMember } from "./entities/pendingMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { SingleEliminationService } from "./singleElimination.service";
import { MemberVariants } from "./types/memberTables.enum";
import { TournamentServiceVariants } from "./types/tournamentServiceVariants.enum";
import { TournamentVariants } from "./types/tournamentVariants.enum";
import { variantToServiceMap } from "./types/variantsService.map";

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(PendingMember)
    private pendingRepository: Repository<PendingMember>,
    private singleElimService: SingleEliminationService,
  ) {}
  private getServiceByTournType(tournType: TournamentVariants) {
    return this[variantToServiceMap[tournType]];
  }

  //TODO: incorporate a set of options parameter that can be passed to type of tournament service
  @Transactional()
  async createTournament(creationData: {
    userId: number;
    name: string;
    tournamentType: TournamentVariants;
  }): Promise<Tournament> {
    const newTournament = await this.tournamentRepository.save(
      this.tournamentRepository.create(creationData),
    );
    await this.getServiceByTournType(creationData.tournamentType).createDetails(
      newTournament.id,
    );
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

    //obtains the corresponding service for a tournament type
    //FUTURE: As more tournaments are added, may need to define an interface for tounrService
    return this.getServiceByTournType(tournamentType).addParticipant(
      singleElimData,
    );
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
  public async incrementTournamentRound(tournId) {
    const tournament = await this.tournamentRepository.findOne(tournId);
    tournament.currentRound++;
    await this.tournamentRepository.save(tournament);
  }
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
  @Transactional()
  async startTournament(tournId: number) {
    /*All pending members not accepted to the tournament should be cleared for a starting tournament*/
    const pendingMembers = await this.pendingRepository.find({ tournId });
    await this.pendingRepository.remove(pendingMembers);

    const tournamentType = (await this.tournamentRepository.findOne(tournId))
      .tournamentType;
    return this.getServiceByTournType(tournamentType);
  }
}
