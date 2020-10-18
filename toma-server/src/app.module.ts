import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, ConfigModule.forRoot(), TournamentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
