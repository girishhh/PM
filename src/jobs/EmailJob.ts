import { Channel } from "amqplib";
import rootPath from "app-root-path";
import Queue from "bull";
import { logger } from "config/LoggerConfig";
import UserMailer from "mailers/UserMailer";

class EmailJob {
  emailQueue: Queue.Queue<any>;

  constructor() {
    this.emailQueue = new Queue("email-queue", process.env.REDIS as string);
    this.emailQueue.on("completed", (job, result) => {
      logger.info(`Job completed JOBID:- ${job.id}`);
    });
    this.perform();
  }

  perform = async () => {
    this.emailQueue.process(`${rootPath}/src/jobs/EmailJobProcess.ts`);
  };

  static async process(message: any, channel: Channel) {
    switch (message.mailType) {
      case "createPasswordMail":
        await UserMailer.createPasswordMail(message.passwordLink, message.user);
        channel.ack(message);
        break;
      case "sendConfirmationMail":
        await UserMailer.sendConfirmationMail(
          message.confirmationLink,
          message.user
        );
        channel.ack(message);
        break;
    }
  }
}

export const emailJob = new EmailJob();
