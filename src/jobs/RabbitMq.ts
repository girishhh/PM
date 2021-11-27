import amqplib, { Channel, Connection } from "amqplib";
import { logger } from "config/LoggerConfig";
import { QUEUE_METADATA } from "constants/QueueConstants";

class RabbitMq {
  rabbitMqPub: Connection | null = null;
  rabbitMqSub: Connection | null = null;
  pubChannel: Channel | null = null;
  subChannel: Channel | null = null;

  async connect() {
    this.rabbitMqPub = await amqplib.connect(process.env.RABBIT_MQ as string);
    this.pubChannel = await this.rabbitMqPub.createChannel();
    this.rabbitMqSub = await amqplib.connect(process.env.RABBIT_MQ as string);
    this.subChannel = await this.rabbitMqSub.createChannel();
    logger.info("RABBIT MQ Connected successfully");
  }

  async publish(queue: string, message: any) {    
    await this.pubChannel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async subscribeToQueues() {
    for (let i = 0; i < QUEUE_METADATA.length; i++) {
      await this.subChannel?.assertQueue(QUEUE_METADATA[i].name);
      this.subChannel?.consume(
        QUEUE_METADATA[i].name,
        QUEUE_METADATA[i].handler
      );
    }
  }
}

export const rabbitMq = new RabbitMq();
