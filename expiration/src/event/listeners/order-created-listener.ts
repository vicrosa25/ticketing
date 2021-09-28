import { Listener, OrderCreatedEvent, Subjects } from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Calculate the 15 minutes delay
    const delay = new Date(data.expireAt).getTime() - new Date().getTime();
    console.log("waiting for miliseconds ", delay);

    // Enqueue a new job
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    // Ack the message
    msg.ack();
  }
}
