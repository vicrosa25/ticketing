import { TicketUpdatedEvent } from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nat-wrapper";
import { TicketUpdatededListener } from "../ticket-updated-listener";
const setup = async () => {
  // 1. Create a listener
  const listener = new TicketUpdatededListener(natsWrapper.client);

  // 2. Create and save a ticket
  const ticket = new Ticket();
  ticket.id = 1;
  ticket.title = "concert";
  ticket.price = 50;
  await ticket.save();

  // 3. Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: 1,
    orderId: null,
  };

  // 4. Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // 5. Return all
  return { listener, ticket, data, msg };
};

it("finds, updates and save a ticket", async () => {
  // 1. Setup
  const { listener, ticket, data, msg } = await setup();

  // 2. Call the onMessage function
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findOne(ticket.id);

  // 3. writte some assertions
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  // 1. Setup
  const { listener, data, msg } = await setup();

  // 2. Call the onMessage function
  await listener.onMessage(data, msg);
  //const updatedTicket = await Ticket.findOne(ticket.id);

  // 3. writte some assertions
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version", async () => {
  // 1. Setup
  const { msg, data, listener } = await setup();

  // 2. Change the version for an future version
  data.version = 10;

  // 2. Call onMessage function
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
