import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
  require("dotenv").config();

import { AppModule } from "./app.module";

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();
