import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { RequestWithUser } from "./../auth/requestWithUser.interface";
import { TournamentService } from "./tournaments.service";
import { TournamentVariants } from "./types/tournamentVariants.enum";
import { PostgresErrorInterceptor } from "./../errorHandling/interceptors/postgresError.interceptor";
import { PendingService } from "./pending.service";
import JwtAuthGuard from "../auth/guards/jwt-auth.guard";

@Controller("tourn")
@UseInterceptors(PostgresErrorInterceptor)
//Any tournament request will at the minimum require a user to be logged in
@UseGuards(JwtAuthGuard)
export class TournController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly pendingService: PendingService,
  ) {}
  @Post("create")
  async createTourn(
    @Body() creationData: { name: string; tournamentType: TournamentVariants },
    @Req() request: RequestWithUser,
  ) {
    const userId = request.user.id;
    return this.tournamentService.createTournament({ ...creationData, userId });
  }
  //NOTE: The frontend will decide whether a addParticipant or addPending is called on a user
  //depending on properties of the tournament.
  @Post("addParticipant")
  async addParticipant(
    @Body()
    participantData: {
      tournamentType: TournamentVariants;
      participantName?: string;
      tournId: number;
      userId?: number;
    },
  ) {
    return this.tournamentService.addParticipantToTournament(participantData);
  }
  @Post("addPending")
  async addPending(
    @Body() pendingBody: { tournId: number },
    @Req() request: RequestWithUser,
  ) {
    const userId = request.user.id;
    return this.pendingService.addUserToPending({
      userId,
      tournId: pendingBody.tournId,
    });
  }
  //TODO: #2 generalize to an array of pending members to accept or reject
  @Post("acceptPending")
  async acceptPending(
    @Body() acceptBody: { tournId: number; pendingUserId: number },
  ) {
    return this.pendingService.acceptPendingUser({
      ...acceptBody,
    });
  }
  @Post("rejectPending")
  async rejectPending(
    @Body() acceptBody: { tournId: number; pendingUserId: number },
  ) {
    return this.pendingService.rejectPendingUser(
      acceptBody.pendingUserId,
      acceptBody.tournId,
    );
  }
  @Post("startTournament")
  async startTournament(@Body() { tournId }: { tournId: number }) {
    return this.tournamentService.startTournament(tournId);
  }
  @Post("advanceRound")
  async advanceRound(@Body() { tournId }: { tournId: number }) {
    return this.tournamentService.advanceRound(tournId);
  }

  @Post("getRemainingTournMembers")
  async getRemainingTournMembers(
    @Body()
    {
      tournId,
      tournamentType,
    }: {
      tournId: number;
      tournamentType: TournamentVariants;
    },
  ) {
    return this.tournamentService.getRemainingTournMembers(
      tournId,
      tournamentType,
    );
  }
  @Post("assignLoss")
  async assignLoss(
    @Body()
    {
      roundNumber,
      memberId,
      tournamentType,
    }: {
      roundNumber: number;
      memberId: number;
      tournamentType: TournamentVariants;
    },
  ) {
    return this.tournamentService.assignLoss({
      roundNumber,
      memberId,
      tournamentType,
    });
  }
  @Post("declareWinner")
  async declareWinner(
    @Body()
    {
      tournId,
      tournamentType,
    }: {
      tournId: number;
      tournamentType?: TournamentVariants;
    },
  ) {
    return this.tournamentService.declareWinner(tournId, tournamentType);
  }
}
