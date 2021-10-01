import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@tfg-victor-rosa/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
