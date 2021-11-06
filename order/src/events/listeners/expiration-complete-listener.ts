import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    // 1. Fetch the order
    const order = await Order.findOne(data.orderId, {relations: ['ticket']});
    // const order = await Order.findOne(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // 2. Check if the order is complete
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // 3. Update and save the order with cancelled status
    // order.status = OrderStatus.Cancelled;
    // await order.save();
   
    await order.remove()

    // 4. Publish an Order Cancelled Event
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      },
    });
    
    // 5. Ack the message
    msg.ack();
  }
}
