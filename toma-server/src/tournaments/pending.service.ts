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
  private async getPendingWithTourn(userId: number, tournId: number) {
    const pendingWithTourn = await this.pendingRepository.findOne(
      { tournId, userId },
      { relations: ["tourn"] },
    );
    if (!pendingWithTourn?.tourn) {
      throw new HttpException(
        "The requested pending user cannot be found",
        HttpStatus.NOT_FOUND,
      );
    }
    return pendingWithTourn;
  }

  @Transactional()
  private async writeAcceptTransactions(
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
  async acceptPendingUser({
    tournId,
    pendingUserId: userId,
  }: {
    tournId: number;
    pendingUserId: number;
  }) {
    const pendingInstance = await this.getPendingWithTourn(userId, tournId);
    const tournamentType = pendingInstance.tourn.tournamentType;
    await this.writeAcceptTransactions(
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
