import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@tfg-victor-rosa/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
