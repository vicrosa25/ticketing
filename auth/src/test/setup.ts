import { User } from "./../models/user";
import { newDb, IBackup } from "pg-mem";
import { Connection } from "typeorm";

let db = newDb();
let backup: any;
let orm: Connection;

beforeAll(async () => {
  //==== create environment variables
  process.env.JWT_KEY = "asdfasdfa";

  //==== create a memory db
  const db = newDb({
    // 👉 Recommanded when using Typeorm .synchronize(), which creates foreign keys but not indices !
    autoCreateForeignKeyIndices: true,
  });

  //==== create a Typeorm connection
  orm = await db.adapters.createTypeormConnection({
    type: "postgres",
    entities: [User],
  });

  await orm.synchronize();
  backup = db.backup();
});

beforeEach(async () => {
  backup.restore();
});

afterAll(async () => {
  orm.close();
});
