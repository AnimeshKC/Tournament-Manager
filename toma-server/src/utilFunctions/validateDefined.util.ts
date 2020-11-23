import { HttpException, HttpStatus } from "@nestjs/common";

export function validateDefined(
  data: any,
  exceptionString = "Cannot find valid data",
  status = HttpStatus.NOT_FOUND,
) {
  //null and undefined should throw but values such as 0 or "" should not throw
  if (data == null) throw new HttpException(exceptionString, status);
}
