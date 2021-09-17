import { Message } from "node-nats-streaming";
import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@tfg-victor-rosa/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatededListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    try {
      const ticket = await Ticket.findOne(id);
      if (!ticket) {
        throw new NotFoundError();
      }

      ticket.title = title;
      ticket.price = price;

      await ticket.save();
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
