import DeadQueueJob from "jobs/DeadQueueJob";
import RabMqEmailJob from "jobs/RabMqEmailJob";

const QUEUE_METADATA = [
  {
    name: "email-queue",
    handler: RabMqEmailJob.process,
    assertOpt: {
        deadLetterExchange: "dlx_exchange",
        deadLetterRoutingKey: "dlx_key",
    },
  },
  {
    name: "dead-letter-queue",
    handler: DeadQueueJob.process,
    assertOpt: {
        deadLetterExchange: "main_exchange",
        deadLetterRoutingKey: "email-queue-key",
    },
  },
];

export { QUEUE_METADATA };
