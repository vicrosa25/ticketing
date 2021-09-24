import { newDb, IBackup } from "pg-mem";
import { Connection } from "typeorm";
import jwt from "jsonwebtoken";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { OccSubscriber } from "../subscriber/occSubs";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock("../nat-wrapper.ts");

let backup: any;
let orm: Connection;

beforeAll(async () => {
  jest.clearAllMocks();
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
    entities: [Order, Ticket],
    subscribers: [OccSubscriber],
  });

  await orm.synchronize();
  backup = db.backup();
});

beforeEach(async () => {
  jest.clearAllMocks();
  backup.restore();
});

afterAll(async () => {
  orm.close();
});

// Fake auth for testing
global.signin = () => {
  // 1. Build a JWT payload. { id, email }
  const randomId = Math.floor(Math.random() * 12000) + 1;
  const payload = {
    id: randomId,
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
