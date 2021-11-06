import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@tfg-victor-rosa/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatededListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, version, title, price, orderId, description } = data;

    const ticket = await Ticket.findByIdAndPreviusVersion(id, version);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.title = title;
    ticket.price = price;
    ticket.description = description;
    ticket.orderId = orderId;

    await ticket.save();
    msg.ack();
  }
}
