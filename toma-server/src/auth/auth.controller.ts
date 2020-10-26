import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";

import { AuthService } from "./auth.service";
import RegisterDTO from "./dto/register.dto";
import { LocalAuthGuard } from "./localAuth.guard";
import RequestWithUser from "./requestWithUser.interface";
import JwtAuthGuard from "./guards/jwt-auth.guard";
import { PostgresErrorInterceptor } from "../errorHandling/interceptors/postgresError.interceptor";

@Controller("auth")
@UseInterceptors(PostgresErrorInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register")
  async register(@Body() registrationData: RegisterDTO): Promise<any> {
    // console.log(registrationData)
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
    const { password, ...resUser } = user;
    return response.send(resUser);
  }
  @UseGuards(JwtAuthGuard)
  @Post("log-out")
  async logout(@Res() response: Response): Promise<Response<any>> {
    response.setHeader("Set-Cookie", this.authService.getLogoutCookie());
    return response.sendStatus(200);
  }
}
