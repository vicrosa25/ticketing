import { User } from "./../models/user";
import { newDb } from "pg-mem";
import { Connection } from "typeorm";
import request from "supertest";
import { app } from "../app";

jest.mock("../helpers/chatUser.ts");

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>;
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


global.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
