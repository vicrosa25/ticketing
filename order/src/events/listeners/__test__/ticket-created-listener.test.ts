import { TicketCreatedEvent } from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nat-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  // 1. Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // 2. Create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: 1,
    version: 1,
    title: "concert",
    price: 20,
    userId: 1,
  };
  // 3. Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  // 1. setup
  const { listener, data, msg } = await setup();

  // 2. call the onMessage function
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findOne(data.id);

  // 3. wite assertions to make sure a ticket was created
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  // 1. Setup
  const { listener, data, msg } = await setup();

  // 2. call the onMessage function
  await listener.onMessage(data, msg);

  // 3. wite assertions to make sure the ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
