import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import RegisterDto from "./dto/register.dto";
import { LocalAuthGuard } from "./localAuth.guard";
import RequestWithUser from "./requestWithUser.interface";
import { Response } from "express";
import JwtAuthGuard from "./guards/jwt-auth.guard";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registrationData: RegisterDto): Promise<any> {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post("log-in")
  async login(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<any> {
    const user = request.user;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader("Set-Cookie", cookie);
    user.password = undefined;
    return user;
  }
  @UseGuards(JwtAuthGuard)
  @Post("log-out")
  async logout(@Res() response: Response): Promise<Response<any>> {
    response.setHeader("Set-Cookie", this.authService.getLogoutCookie());
    return response.sendStatus(200);
  }
}
