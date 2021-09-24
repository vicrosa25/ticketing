import { natsWrapper } from "../../../nat-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // 1. Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // 2. Create and save a ticke
  const ticket = new Ticket();
  ticket.title = "concert";
  ticket.price = 99;
  ticket.userId = 1;
  await ticket.save();

  // 3. Create a fake data object
  const data: OrderCreatedEvent["data"] = {
    id: 1,
    version: 1,
    userId: 1,
    status: OrderStatus.Created,
    expireAt: "alsdkjfalskdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // 4. Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  // 1. setup
  const { listener, ticket, data, msg } = await setup();

  // 2. Call the onMessage function
  await listener.onMessage(data, msg);

  // 3. Fetch the reserved ticket
  const reservedTicket = await Ticket.findOne(ticket.id);

  // 3. Assertions
  expect(reservedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  // 1. setup
  const { listener, data, msg } = await setup();

  // 2. Call the onMessage function
  await listener.onMessage(data, msg);

  // 3. Assertions
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  // 1. Setup
  const { listener, data, msg } = await setup();

  // 2. Call the onMessage function
  await listener.onMessage(data, msg);

  // 3. Assertions
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // 4. check publish function arguments
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
