import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import bcrypt from "bcrypt";
import RegisterDto from "./dto/register.dto";
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
      throw new HttpException(
        "Something went wrong",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
