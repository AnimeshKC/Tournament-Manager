import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, id?: any) => void) {
    return done(null, user.id);
  }
  deserializeUser(payload: any, done: (err: Error, value: any) => void) {
    return done(null, payload);
  }
}
