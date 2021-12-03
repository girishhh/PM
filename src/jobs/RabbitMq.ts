import amqplib, { Channel, Connection } from "amqplib";
import { logger } from "config/LoggerConfig";

class RabbitMq {
  rabbitMqPub: Connection | null = null;
  pubChannel: Channel | null = null;

  async connect() {
    this.rabbitMqPub = await amqplib.connect(process.env.RABBIT_MQ as string);
    this.pubChannel = await this.rabbitMqPub.createChannel();    
    logger.info("RABBIT MQ Connected successfully");
  }

  async publish(exhange: string, routeKey: string, message: any) {
    this.pubChannel?.publish(
      exhange,
      routeKey,
      Buffer.from(JSON.stringify(message))
    );
  }
}

export const rabbitMq = new RabbitMq();
