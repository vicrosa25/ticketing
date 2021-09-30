import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@tfg-victor-rosa/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = new Order();
    order.id = data.id;
    order.version = data.version;
    order.status = data.status;
    order.userId = data.userId;
    order.price = data.ticket.price;

    await order.save();

    msg.ack();
  }
}
