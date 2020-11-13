import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { PendingMember } from "./entities/pendingMember.entity";
import { TournamentService } from "./tournaments.service";
import { TournamentVariants } from "./types/tournamentVariants.enum";

@Injectable()
export class PendingService {
  constructor(
    @InjectRepository(PendingMember)
    private readonly pendingRepository: Repository<PendingMember>,
    private readonly tournamentService: TournamentService,
  ) {}
  async addUserToPending(pendingData: { userId: number; tournId: number }) {
    const pendingUser = this.pendingRepository.create(pendingData);
    await this.pendingRepository.save(pendingUser);
    return pendingUser;
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

  @Transactional()
  private async deletePending_addUser_transaction(
    pendingInstanceId: number,
    userId: number,
    tournId: number,
    tournamentType: TournamentVariants,
  ) {
    await Promise.all([
      this.pendingRepository.delete(pendingInstanceId),
      this.tournamentService.addParticipantToTournament({
        tournamentType,
        userId,
        tournId,
      }),
    ]);
  }
  async acceptPendingUser(acceptData: {
    managerId: number;
    tournId: number;
    pendingUserId: number;
  }) {
    const { tournId, managerId, pendingUserId: userId } = acceptData;

    const pendingInstance = await this.joinPendingAndTourn(userId, tournId);

    const tournamentType = pendingInstance.tourn.tournamentType;

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
  async rejectPendingUser(userId: number, tournId: number) {
    const pendingInstance = await this.obtainPendingInstance(userId, tournId);
    await this.pendingRepository.delete(pendingInstance.id);
    return "Success";
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
}
