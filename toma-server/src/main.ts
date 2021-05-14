import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { resolve } from "path";
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import * as exphbs from "express-handlebars";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
  require("dotenv").config();

import { AppModule } from "./app.module";

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(resolve("./src/public"));
  app.setBaseViewsDir(resolve("./src/views"));
  app.setViewEngine("hbs");
  await app.listen(5000);
}
bootstrap();
