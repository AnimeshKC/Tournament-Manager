import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import PostgresErrorCode from "../../database/postgresErrorCodes.enum";

@Injectable()
export class PostgresErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (
          error.code &&
          Object.values(PostgresErrorCode).includes(error.code)
        ) {
          throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
        }
        throw error;
      }),
    );
  }
}
