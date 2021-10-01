import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymenCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findOne(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Complete;
    await order.save();
    msg.ack();
  }
}
