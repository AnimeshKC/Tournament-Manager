import { Strategy } from "passport-local";
import { AuthModuleOptions, PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "src/entity/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly options: AuthModuleOptions,
  ) {
    super({ usernameField: "username", passwordField: "password" });
  }
  async validate(username: string, password: string): Promise<User> {
    return this.authService.getAuthenticatedUser(username, password);
  }
  public successRedirect: string = this.options["successRedirect"];
  public failureRedirect: string = this.options["failureRedirect"];
}
