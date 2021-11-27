import RabMqEmailJob from "jobs/RabMqEmailJob";

const QUEUE_METADATA = [{name: "email-queue", handler: RabMqEmailJob.process}];

export { QUEUE_METADATA }