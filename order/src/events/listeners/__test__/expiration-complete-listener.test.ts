import { ExpirationCompleteEvent, OrderStatus } from "@tfg-victor-rosa/common";
import { natsWrapper } from "../../../nat-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // 1. Create the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // 2. Create an order and a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.title = "concert";
  ticket.price = 20;
  ticket.description = 'description';
  await ticket.save();

  const order = new Order();
  order.status = OrderStatus.Created;
  order.userId = 1;
  order.expireAt = new Date();
  order.ticket = ticket;
  await order.save();

  // 3. Create the fake data
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // 4. Create a fake Message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("emits an order cancelled event", async () => {
  // 1. setup
  const { listener, order, data, msg } = await setup();

  // 2. Call the onMessage function
  await listener.onMessage(data, msg);

  // Assertion
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // 3. Take the event data from mock function natWrapper.client.publish()
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  // 4. Assertions the orde has been deleted
  expect(eventData.id).toBeUndefined();
});

it("acks the message", async () => {
  // 1. setup
  const { listener, data, msg } = await setup();

  // 2. Call the onMessage function
  await listener.onMessage(data, msg);

  // 3. Assertion
  expect(msg.ack).toHaveBeenCalled();
});
