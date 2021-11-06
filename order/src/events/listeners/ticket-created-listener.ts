import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@tfg-victor-rosa/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { Photo } from "../../models/Photo";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, photos, description } = data;
    const ticket = new Ticket();
    ticket.id = id;
    ticket.title = title;
    ticket.price = price;
    ticket.description = description;

    for (const photo of photos) {
      const newPhoto = new Photo();
      newPhoto.cloudId = photo.cloudId;
      newPhoto.url = photo.url;
      newPhoto.secureUrl = photo.secureUrl;
      newPhoto.ticket = ticket;
      ticket.addPhoto(newPhoto);
    }

    try {
      await ticket.save();
    } catch (error) {
      console.log(error);
    }
    msg.ack();
  }
}
