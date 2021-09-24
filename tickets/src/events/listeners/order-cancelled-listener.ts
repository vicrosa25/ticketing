import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findOne(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.orderId = null;

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      orderId: ticket.orderId,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
    });

    msg.ack();
  }
}
