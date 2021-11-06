import { natsWrapper } from "../../../nat-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent } from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { Photo } from "../../../models/Photo";

const setup = async () => {
  // 1. Create the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // 2. Create and save a ticket
  const photo = new Photo()
  photo.cloudId = "asdfasd";
  photo.url = "asldkfasldf";
  photo.secureUrl = "sla;ldskfja";
  const images = [];
  images.push(photo);
  const ticket = new Ticket();
  ticket.title = "concert";
  ticket.price = 99;
  ticket.description = "description"
  ticket.userId = 1;
  ticket.photos = images;
  await ticket.save();

  // 3. Create a fake data
  const data: OrderCancelledEvent["data"] = {
    id: 1,
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };

  // 4. Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("updates, publishes an event, and acks the message", async () => {
  // 1. Setup
  const { listener, ticket, data, msg } = await setup();

  // 2. Call onMessage function
  await listener.onMessage(data, msg);

  // 3. fetch the updated ticket
  const updatedTicket = await Ticket.findOne(ticket.id);

  // 4. Assertions
  expect(updatedTicket!.orderId).toBeNull();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
