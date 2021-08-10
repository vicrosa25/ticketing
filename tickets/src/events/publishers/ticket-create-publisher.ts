import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@tfg-victor-rosa/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
