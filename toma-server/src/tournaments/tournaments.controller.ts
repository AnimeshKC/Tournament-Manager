import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import JwtAuthGuard from "src/auth/guards/jwt-auth.guard";
import RequestWithUser from "src/auth/requestWithUser.interface";
import AddPartipantDto from "./dto/addParticipant.dto";
import { TournamentService } from "./tournaments.service";
import { TournamentVariants } from "./types/tournamentVariants.enum";

@Controller("tourn")
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
  async addParticipant(@Body() participantData: AddPartipantDto) {
    return this.tournamentService.addParticipantToTournament(participantData);
  }
}
