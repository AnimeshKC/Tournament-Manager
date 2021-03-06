import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { singleEliminationMatches } from "./entities/singleElimMatches.entity";
import { PendingMember } from "./entities/pendingMember.entity";
import { SingleElimDetails } from "./entities/singleElimDetails.entity";
import { SingleElimMember } from "./entities/singleElimMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { PendingService } from "./pending.service";
import { SingleEliminationService } from "./singleElimination.service";
import { TournController } from "./tournaments.controller";
import { TournamentService } from "./tournaments.service";
import { TournGenericService } from "./tournGeneric.service";
export const tournamentModuleEntities = [
  Tournament,
  SingleElimMember,
  PendingMember,
  singleEliminationMatches,
  SingleElimDetails,
];
@Module({
  controllers: [TournController],
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature(tournamentModuleEntities),
  ],
  providers: [
    TournamentService,
    SingleEliminationService,
    TournGenericService,
    PendingService,
  ],
})
export class TournamentsModule {}
