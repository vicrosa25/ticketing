import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  // 1. Create a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.title = "Test";
  ticket.price = 43;
  await ticket.save();

  // 2. Create an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/order")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // 3. Macke a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/order/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
  expect(fetchedOrder.ticket.id).toEqual(ticket.id);
});

it("return 401 error when a user try to see an order from other user", async () => {
  // 1. Create a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.title = "Test";
  ticket.price = 43;
  await ticket.save();

  // 2. Create an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/order")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // 3. Macke a request to fetch the order with a different user
  await request(app)
    .get(`/api/order/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
