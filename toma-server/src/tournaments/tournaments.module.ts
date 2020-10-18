import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { SingleElimMember } from "./entities/singleElimMember.entity";
import { Tournament } from "./entities/tournament.entity";
import { SingleEliminationService } from "./singleElimination.service";
import { TournamentService } from "./tournaments.service";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Tournament, SingleElimMember]),
  ],
  providers: [TournamentService, SingleEliminationService],
})
export class TournamentsModule {}
