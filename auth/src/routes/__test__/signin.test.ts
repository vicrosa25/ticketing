import request from "supertest";
import { app } from "../../app";
import { User } from '../../models/user';

it("fails when a email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  // 1. Create a user
  const user = new User();
  user.email = 'test@test.com';
  user.password = 'password';
  await user.save();

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "perkins",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  // 1. Create a user
  const user = new User();
  user.email = 'test@test.com';
  user.password = 'password';
  await user.save();

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
