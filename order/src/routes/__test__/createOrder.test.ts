import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nat-wrapper";

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
  ticket.id = 1;
  ticket.title = "Test ticket";
  ticket.price = 12;
  ticket.description = 'description';
  await ticket.save();

  const order = new Order();
  order.ticket = ticket;
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
  ticket.id = 1;
  ticket.title = "concert";
  ticket.price = 20;
  ticket.description = 'description';
  await ticket.save();

  // Request, create an order on a free ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order create event", async () => {
  // Setup
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.title = "concert";
  ticket.price = 20;
  ticket.description = 'description';
  await ticket.save();

  // Request, create an order on a free ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
