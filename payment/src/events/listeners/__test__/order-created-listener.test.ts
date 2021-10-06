import { natsWrapper } from "../../../nat-wrapper";
import { OrderCreatedListener } from "../order-create-listener";
import { OrderCreatedEvent, OrderStatus } from "@tfg-victor-rosa/common";
import { Order } from "../../../models/order";

const setup = async () => {
  // 1. create the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // 2. Create a fake data
  const data: OrderCreatedEvent["data"] = {
    id: 1,
    version: 1,
    userId: 1,
    expireAt: "adsfdsa",
    status: OrderStatus.Created,
    ticket: {
      id: 1,
      price: 10,
    },
  };

  // 3. fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates ther order info", async () => {
  // 1. setup
  const { listener, data, msg } = await setup();

  // 2. Call onMessage function
  await listener.onMessage(data, msg);

  // 3. fetch the new oder
  const order = await Order.findOne(data.id);

  // 4. assertion
  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  // 1. setup
  const { listener, data, msg } = await setup();

  // 2. Call onMessage function
  await listener.onMessage(data, msg);

  // 3. Assertino
  expect(msg.ack).toHaveBeenCalled();
});
