import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import bcrypt from "bcrypt";
import RegisterDto from "./dto/register.dto";
import PostgresErrorCode from "src/database/postgresErrorCodes.enum";
const saltRounds = 10;
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  public async register(registrationData: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(
        registrationData.password,
        saltRounds,
      );
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        const message = error?.detail || "Username or Email already exists"; //this fail-safe is likely unneeded
        throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
      }
      const message: string = error?.message || "Something went wrong";
      //TODO: More precise Error Handling
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  public async getAuthenticatedUser(username: string, password: string) {
    try {
      const user = await this.usersService.findByUsername(username);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      //TODO: Fine Tune Error Handling
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
