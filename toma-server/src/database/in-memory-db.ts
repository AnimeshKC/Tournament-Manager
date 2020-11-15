import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { newDb } from "pg-mem/src/db";
import { Connection } from "typeorm";
import { tournamentModuleEntities } from "../tournaments/tournaments.module";
import { UserModuleEntities } from "../users/users.module";

const allEntities = [...tournamentModuleEntities, ...UserModuleEntities];
export async function getInMemoryDB(
  entityArr: EntityClassOrSchema[] = allEntities,
) {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  const conn: Connection = await db.adapters.createTypeormConnection({
    type: "postgres",
    entities: entityArr,
  });
  return conn;
}
//NOTE: Must close connection when using
