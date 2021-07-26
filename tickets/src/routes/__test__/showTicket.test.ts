import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the tikets is not found", async () => {
  const response = await request(app).get("/api/tickets/1").send();
});

it("returns the tikets it is found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
