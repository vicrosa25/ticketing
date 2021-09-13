import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@tfg-victor-rosa/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
