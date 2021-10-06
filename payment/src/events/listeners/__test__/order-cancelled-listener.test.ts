import { natsWrapper } from "../../../nat-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@tfg-victor-rosa/common";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // 1. Create the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // 2. Creaet an order
  const order = new Order();
  order.id = 1;
  order.userId = 1;
  order.status = OrderStatus.Created;
  order.price = 10;

  await order.save();

  // 2. Create a fake data
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 1,
    },
  };

  // 3. fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("changes the order status to cancelled", async () => {
  // 1. setup
  const { listener, data, msg } = await setup();

  // 2. Call onMessage function
  await listener.onMessage(data, msg);

  /// 3. fetch the new oder
  const order = await Order.findOne(data.id);

  // 4. assertion
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  // 1. setup
  const { listener, data, msg } = await setup();

  // 2. Call onMessage function
  await listener.onMessage(data, msg);

  // 3. Assertion
  expect(msg.ack).toHaveBeenCalled();
});
