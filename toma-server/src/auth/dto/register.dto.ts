import { ValidationPipe } from "@nestjs/common";
import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "src/decorators/match.decorator";
ValidationPipe;
export default class RegisterDto {
  @IsEmail({}, { message: "Not a valid email address" })
  @MaxLength(255, { message: "Must not exceed 255 characters" })
  email: string;
  @MaxLength(64, { message: "Must not exceed 64 characters" })
  username: string;
  @MinLength(8, { message: "Must have at least 8 characters" })
  @MaxLength(255, { message: "Must not exceed 255 characters" })
  @Matches(/(?=.*d)/, { message: "Must contain a number" })
  @Matches(/(?=.*[\W_])/, {
    message: "Must contain a special character",
  })
  @Matches(/(?=.*[A-Z])/, {
    message: "Must contain an uppercase letter",
  })
  @Matches(/(?=.*[a-z])/, { message: "Must contain a lowercase letter" })
  password: string;
  @Match("password", { message: "password and confirm password do not match" })
  confirmPassword: string;
}
