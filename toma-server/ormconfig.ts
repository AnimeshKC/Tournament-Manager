import { ConnectionOptions } from "typeorm";
import * as PostgressConnectionStringParser from "pg-connection-string";
import { join } from "path";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
  require("dotenv").config();

const {
  host,
  port,
  user,
  password,
  database,
} = PostgressConnectionStringParser.parse(process.env.DATABASE_URL);
const portNum = parseInt(port) || 5432;
const config: ConnectionOptions = {
  type: "postgres",
  host,
  port: portNum,
  username: user,
  password: password,
  database,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: "file",

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  // migrations: [__dirname + "/migrations/**/*{.ts,.js}"]
  // migrations: ["src/migrations/**/*{.ts,.js}"],
  migrations: [join(__dirname + "src/migrations/**/*{.ts,.js}")],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: "src/migrations",
  },
};

export = config;
