import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@tfg-victor-rosa/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
