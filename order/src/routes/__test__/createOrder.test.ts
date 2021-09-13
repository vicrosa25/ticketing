import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("returns a 404 error, if the ticket does not exists", async () => {
  const ticketId = 32;
  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns a 400 error if the ticket is already reserved", async () => {
  // Setup
  const ticket = new Ticket();
  ticket.title = "Test ticket";
  ticket.price = 12;
  await ticket.save();

  const order = new Order();
  order.ticket = ticket;
  order.ticketid = ticket.id;
  order.userId = 243;
  order.status = OrderStatus.AwaitingPayment;
  order.expireAt = new Date();
  await order.save();

  // request create an order on a reserved ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  // Setup
  const ticket = new Ticket();
  ticket.title = "concert";
  ticket.price = 20;
  await ticket.save();

  // Request, create an order on a free ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo("emits an order create event");
