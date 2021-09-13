import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@tfg-victor-rosa/common";
import { natsWrapper } from "../../nat-wrapper";

it("Cancels an order", async () => {
  // 1. Create a ticket
  const ticket = new Ticket();
  ticket.title = "Test";
  ticket.price = 45;
  await ticket.save();

  const user = global.signin();
  // 2. Create a order
  const { body: order } = await request(app)
    .post("/api/order")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // 3. Cancel the order
  await request(app)
    .delete(`/api/order/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // 4. Get the canceled order from the database
  const cancelledOrder = await Order.findOne(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  // 1. Create a ticket
  const ticket = new Ticket();
  ticket.title = "Test";
  ticket.price = 45;
  await ticket.save();

  const user = global.signin();
  // 2. Create a order
  const { body: order } = await request(app)
    .post("/api/order")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // 3. Cancel the order
  await request(app)
    .delete(`/api/order/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // 4. Check for the event
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
