import { newDb } from "pg-mem";
import { Connection } from "typeorm";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

//let db = newDb();
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
    entities: [],
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

global.signin = () => {
  // 1. Build a JWT payload. { id, email }
  const payload = {
    id: "12341234",
    email: "test@test.com",
  };

  // 2. Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // 3. Build the session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // 4. Turn that session int JSON
  const sessionJson = JSON.stringify(session);

  // 5. Take JSON and encode it as basse64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // 6. Return a string thats the cookie with encode data
  return [`express:sess=${base64}`];
};
