import { queueWorker } from "workers/QueueWorker";

class DeadQueueJob {
  static process(msg: any) {
    const message = JSON.parse(msg.content.toString());
    console.log("DEAD QUEUE", msg.properties.headers["x-death"][0].count);
    if (msg.properties.headers["x-death"][0].count >= 3) {
      queueWorker.subChannel?.ack(msg);
    } else {      
      queueWorker.subChannel?.reject(msg, false);
    }
  }
}

export default DeadQueueJob;
