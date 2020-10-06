import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
  require("dotenv").config();

import { AppModule } from "./app.module";

cookieParser;
cookieSession;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(cookieSession({ secret: process.env.SESSION_SECRET }));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
