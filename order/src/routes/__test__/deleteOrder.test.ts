import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nat-wrapper";

it("Cancels an order", async () => {
  // 1. Create a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.title = "Test";
  ticket.price = 45;
  ticket.description = 'description';
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

  // 4. Get the canceled order from the database it must be undefined
  const cancelledOrder = await Order.findOne(order.id);

  expect(cancelledOrder).toBeUndefined();
});

it("emits an order cancelled event", async () => {
  // 1. Create a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.title = "Test";
  ticket.price = 45;
  ticket.description = 'description';
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
