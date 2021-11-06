import { Listener, OrderCancelledEvent, Subjects } from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // De queue a job
    const jobs = await expirationQueue.getJobs(['delayed']);

    for (const job of jobs) {
      job.remove();
    }

    // await expirationQueue.removeJobs(String(data.id));
    msg.ack();

  }
}