import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import TokenPayload from "./tokenPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // console.log(request?.cookies?.Authentication)
          // console.log(configService.get("JWT_SECRET"))
          return request?.cookies?.Authentication
        },
      ]),
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }
  async validate(payload: TokenPayload) {
    // console.log(payload)
    return this.userService.findById(payload.userId);
  }
}
