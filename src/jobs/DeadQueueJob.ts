import { queueWorker } from "workers/QueueWorker";

class DeadQueueJob {
  static process(msg: any) {
    const message = JSON.parse(msg.content.toString());    
    if (msg.properties.headers["x-death"][0].count > 4) {
      queueWorker.subChannel?.ack(msg);
    } else {      
      console.log("DEAD QUEUE", msg.properties.headers["x-death"]);
      queueWorker.subChannel?.reject(msg, false);
    }
  }
}

export default DeadQueueJob;
