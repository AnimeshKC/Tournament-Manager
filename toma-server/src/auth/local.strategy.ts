import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "username", passwordField: "password" });
  }
  async validate(username: string, password: string) {
    return this.authService.getAuthenticatedUser(username, password);
  }
}
