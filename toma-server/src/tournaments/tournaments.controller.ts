import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import JwtAuthGuard from "src/auth/guards/jwt-auth.guard";
import RequestWithUser from "src/auth/requestWithUser.interface";
import { TournamentService } from "./tournaments.service";
import { TournamentVariants } from "./types/tournamentVariants.enum";
import { PostgresErrorInterceptor } from "./../errorHandling/interceptors/postgresError.interceptor";
@Controller("tourn")
@UseInterceptors(PostgresErrorInterceptor)
export class TournController {
  constructor(private readonly tournamentService: TournamentService) {}
  @UseGuards(JwtAuthGuard)
  @Post("create")
  async createTourn(
    @Body() creationData: { name: string; type: TournamentVariants },
    @Req() request: RequestWithUser,
  ) {
    const userId = request.user.id;
    return this.tournamentService.createTournament({ ...creationData, userId });
  }
  @Post("addParticipant")
  async addParticipant(
    @Body()
    participantData: {
      tournamentType: TournamentVariants;
      participantName: string;
      tournId: number;
    },
  ) {
    return this.tournamentService.addParticipantToTournament(participantData);
  }
  @UseGuards(JwtAuthGuard)
  @Post("addPending")
  async addPending(
    @Body() pendingBody: { tournId: number },
    @Req() request: RequestWithUser,
  ) {
    const userId = request.user.id;
    return this.tournamentService.addUserToPending({
      userId,
      tournId: pendingBody.tournId,
    });
  }
  @UseGuards(JwtAuthGuard)
  @Post("acceptPending")
  async acceptPending(
    @Body() acceptBody: { tournId: number; pendingUserId: number },
    @Req() request: RequestWithUser,
  ) {
    const managerId = request.user.id;
    return this.tournamentService.acceptPendingUser({
      managerId,
      ...acceptBody,
    });
  }
}
