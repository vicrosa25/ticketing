import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";

const buildTicket = async (id: number) => {
  const ticket = new Ticket();
  ticket.id = id;
  ticket.title = "Test";
  ticket.price = 34;
  await ticket.save();
  return ticket;
};

it("fetches orders from a particular user", async () => {
  // 1. Crea three tickets
  const ticketOne = await buildTicket(1);
  const ticketTwo = await buildTicket(2);
  const ticketThree = await buildTicket(3);

  const userOne = global.signin();
  const userTwo = global.signin();

  // 2. Create one order as User #1
  await request(app)
    .post("/api/order")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // 3. Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/order")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/order")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  //4. Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // 5. Check we only got orders with ticket for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
