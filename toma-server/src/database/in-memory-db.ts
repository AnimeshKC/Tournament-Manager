import { newDb } from "pg-mem/src/db";
import { Connection } from "typeorm";
import { tournamentModuleEntities } from "../tournaments/tournaments.module";
import { UserModuleEntities } from "../users/users.module";

export async function getInMemoryDB() {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  const conn: Connection = await db.adapters.createTypeormConnection({
    type: "postgres",
    entities: [...tournamentModuleEntities, ...UserModuleEntities],
  });
  return conn;
}
//NOTE: Must close connection when using
