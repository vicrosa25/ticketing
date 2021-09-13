import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from "@tfg-victor-rosa/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
