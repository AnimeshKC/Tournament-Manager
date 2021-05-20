import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import RegisterDTO from "./dto/register.dto";
import TokenPayload from "./tokenPayload.interface";

import PostgresErrorCode from "../database/postgresErrorCodes.enum";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public async register(registrationData: RegisterDTO) {
    // console.log(registrationData)
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
      return this.getUserOutput(createdUser);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
  private getUserOutput(userData: User) {
    const { password, ...userOutput } = userData;
    return userOutput;
  }
  public async getAuthenticatedUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    await this.verifyPassword(password, user.password);
    return this.getUserOutput(user);
  }
  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      "JWT_EXPIRATION_TIME",
    )}`;
  }
  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException("invalidLogin");
      // throw new HttpException(
      //   "Wrong credentials provided",
      //   HttpStatus.BAD_REQUEST,
      // );
    }
  }
  public getLogoutCookie(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
