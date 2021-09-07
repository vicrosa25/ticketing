import request from "supertest";
import { app } from "../../app";

it("returns an 404 error, if the ticket does not exists", async () => {
  const ticketId = 32;
  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {});

it("reserves a ticket", async () => {});
