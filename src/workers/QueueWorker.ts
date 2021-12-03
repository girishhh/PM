import dotenv from "dotenv";
dotenv.config();
import amqplib, { Channel, Connection } from "amqplib";
import { logger } from "config/LoggerConfig";
import { QUEUE_METADATA } from "constants/QueueConstants";

class QueueWorker {
  rabbitMqSub: Connection | null = null;
  subChannel: Channel | null = null;

  async connect() {
    this.rabbitMqSub = await amqplib.connect(process.env.RABBIT_MQ as string);
    this.subChannel = await this.rabbitMqSub.createChannel();   
    await Promise.all([this.subChannel.assertExchange("main_exchange", "direct"), this.subChannel.assertExchange("dlx_exchange","direct")]);
    logger.info("RABBIT MQ CONSUMER Connected successfully");
    this.subscribeToQueues();
  }

  async subscribeToQueues() {    
    for (let i = 0; i < QUEUE_METADATA.length; i++) {
      await this.subChannel?.assertQueue(QUEUE_METADATA[i].name, QUEUE_METADATA[i].assertOpt);
      this.subChannel?.consume(
        QUEUE_METADATA[i].name,
        QUEUE_METADATA[i].handler
      );
    }
    await Promise.all([this.subChannel?.bindQueue("email-queue","main_exchange","email-queue-key"),this.subChannel?.bindQueue("dead-letter-queue","dlx_exchange","dlx_key") ]);    
  }
}

export const queueWorker = new QueueWorker();
queueWorker.connect();
