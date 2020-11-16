import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "../../decorators/match.decorator";

export default class RegisterDTO {
  @IsEmail({}, { message: "email: not a valid address" })
  @MaxLength(255, { message: "email: must not exceed 255 characters" })
  email: string;
  @MaxLength(64, { message: "username: must not exceed 64 characters" })
  username: string;
  @MinLength(8, { message: "password: must have at least 8 characters" })
  @MaxLength(255, { message: "password: must not exceed 255 characters" })
  @Matches(/(?=.*\d)/, { message: "password: must contain a number" })
  @Matches(/(?=.*[\W_])/, {
    message: "password: must contain a special character",
  })
  @Matches(/(?=.*[A-Z])/, {
    message: "password: must contain an uppercase letter",
  })
  @Matches(/(?=.*[a-z])/, {
    message: "password: must contain a lowercase letter",
  })
  password: string;
  @Match("password", { message: "confirmPassword: must match password" })
  confirmPassword: string;
}
