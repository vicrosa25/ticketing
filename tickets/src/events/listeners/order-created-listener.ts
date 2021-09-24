import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
} from "@tfg-victor-rosa/common";
import { Subjects } from "@tfg-victor-rosa/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // 1. fetch the ticket that the order is reserving
    const ticket = await Ticket.findOne(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // 2. Reserv the ticket wit h the orderId
    ticket.orderId = data.id;

    // 3. Save the ticket.
    await ticket.save();

    // 4. Publish an event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // 5. Ack the message
    msg.ack();
  }
}
