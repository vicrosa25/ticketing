import Queue from "bull";
import { ExpirationCompletePublisher } from "../event/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nat-wrapper";

interface Payload {
  orderId: number;
}

// Create the queue
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// Procces a job
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
