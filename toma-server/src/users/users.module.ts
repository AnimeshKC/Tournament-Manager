import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

export const UserModuleEntities = [User];
@Module({
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature(UserModuleEntities)],
  exports: [UsersService],
})
export class UsersModule {}
