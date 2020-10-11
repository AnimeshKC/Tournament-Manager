import { User } from "src/users/entities/user.entity";
import { Request } from "express";
export default interface RequestWithUser extends Request {
  user: User;
}
