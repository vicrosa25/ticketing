import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findByIdAndPreviusVersion(data.id, data.version);

    if (!order) {
      throw new Error("Ordern not found");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    msg.ack();
  }
}
