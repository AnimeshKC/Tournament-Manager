import { HttpException, HttpStatus } from "@nestjs/common";

export function validateDefined(
  data: any,
  exceptionString = "Cannot find valid data",
  status = HttpStatus.NOT_FOUND,
) {
  if (!data) throw new HttpException(exceptionString, status);
}
