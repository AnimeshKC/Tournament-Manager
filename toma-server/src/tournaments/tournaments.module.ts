import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";
import { Matches } from "./entities/matches.entity";
import { PendingMember } from "./entities/pendingMember.entity";
import { SingleElimDetails } from "./entities/singleElimDetails.entity";
import { SingleElimMember } from "./entities/singleElimMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { SingleEliminationService } from "./singleElimination.service";
import { TournController } from "./tournaments.controller";
import { TournamentService } from "./tournaments.service";

@Module({
  controllers: [TournController],
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([
      Tournament,
      SingleElimMember,
      PendingMember,
      Matches,
      SingleElimDetails,
    ]),
  ],
  providers: [TournamentService, SingleEliminationService],
})
export class TournamentsModule {}
