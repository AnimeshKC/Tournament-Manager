import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { newDb } from "pg-mem";
// import { newDb } from "pg-mem/src/db"
import { Connection } from "typeorm";
import { tournamentModuleEntities } from "../tournaments/tournaments.module";
import { User } from "../users/entities/user.entity";
import { UserModuleEntities } from "../users/users.module";
const allEntities = [...tournamentModuleEntities, ...UserModuleEntities];
export async function getInMemoryDB(
  entityArr: EntityClassOrSchema[] = allEntities,
) {
  try {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    const conn: Connection = await db.adapters.createTypeormConnection({
      type: "postgres",
      entities: entityArr,
    });
    return conn;
  } catch (e) {
    throw e;
  }
}
async function test() {
  const conn = await getInMemoryDB();
  await conn.synchronize();
  console.log("this runs");
  // console.log(conn);
  const users = conn.getRepository(User);
  console.log("users was assigned");
  console.log(users);
  const u = users.create({
    email: "user1@gmail.com",
    username: "u1",
    password: "abcD123!",
  });
  console.log(u);
  // console.log((users as any).tableName);

  /*   ERROR: 
    "Cannot find table 'user' " even though the users object contains the 'user' table
 */
  const a = await users.save(u);
  console.log(a);
  conn.close();
}
test();
//NOTE: Must close connection when using
