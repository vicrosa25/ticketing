import { newDb, IBackup } from "pg-mem";
import { User } from "./../models/user";

let db = newDb();
let backup: IBackup;
let orm: any;

export async function createOrm() {
  // close old instance
  // (typeorm has static stuff which prevents intiating multiple connection)
  await orm?.close();

  // create new instance
  orm = await db.adapters.createTypeormConnection({
    type: "postgres",
    entities: [User],
  });

  if (!backup) {
    // this is the first test to run using this schema
    // ... lets create your tables
    //   (if you have thousands, this could be heavy)
    await orm.synchronize();

    // custom requests ? fill some shared data, etc...

    // Then, create a backup of this empty database with created schema
    // nb: this is instantaneous (o(1))
    backup = db.backup();
  } else {
    // Okay, a previous test already create the DB schema
    // => lets restore data as it was after schema creation
    // nb: this is instantaneous (o(1))
    backup.restore();
  }
  return orm;
}
