import { User } from "src/users/user.entity";
import { Request } from "express";
export default interface RequestWithUser extends Request {
  user: User;
}
