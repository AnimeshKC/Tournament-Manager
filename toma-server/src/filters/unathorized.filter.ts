import {
  UnauthorizedException,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from "@nestjs/common";
import { LocalStrategy } from "src/auth/local.strategy";
import { Response } from "express";
@Catch(UnauthorizedException, ForbiddenException)
export class Unathorized implements ExceptionFilter {
  constructor(private readonly strategy: LocalStrategy) {}
  catch(
    _exception: ForbiddenException | UnauthorizedException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.redirect(this.strategy.failureRedirect);
  }
}
