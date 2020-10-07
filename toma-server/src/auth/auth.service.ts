import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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
      if (!createdUser) throw new UnauthorizedException("Unknown user");
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        const message = error?.detail || "Username or Email already exists"; //this fail-safe is likely unneeded
        throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
  public async getAuthenticatedUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    await this.verifyPassword(password, user.password);
    user.password = undefined;
    return user;
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
