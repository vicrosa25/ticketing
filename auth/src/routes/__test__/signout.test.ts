import request from "supertest";
import { app } from "../../app";
import { User } from '../../models/user';

it("clears the cookie after signing out", async () => {
  // 1. Create a user
  const user = new User();
  user.email = 'test@test.com';
  user.password = 'password';
  await user.save();

  // 2. Signin the uiser
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  // 3. Signout the user
  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  // 4. Assertion
  expect(response.get("session")).toBeUndefined();
});
