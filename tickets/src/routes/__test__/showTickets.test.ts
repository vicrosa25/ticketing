import request from "supertest";
import { app } from "../../app";

// Helper function
const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
};

it("returns all the tickets", async () => {
  await createTicket("test1 ticket", 12);
  await createTicket("test2 ticket", 20);

  // 1. checkt the request is well done
  const response = await request(app).get("/api/tickets").expect(200);

  // 2. check the number of tickets create
  expect(response.body.length).toEqual(2);
});
