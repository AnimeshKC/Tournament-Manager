import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { SessionSerializer } from "./session.serializer";

@Module({
  providers: [AuthService, LocalStrategy, SessionSerializer],
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
