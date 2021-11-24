import rootPath from "app-root-path";
import Queue from "bull";
import { logger } from "config/LoggerConfig";

class EmailJob {
  emailQueue: Queue.Queue<any>;
  constructor() {
    this.emailQueue = new Queue("email-queue", "redis://192.168.99.100:6379");
    this.emailQueue.on('completed', (job, result) => {
      logger.info(`Job completed JOBID:- ${job.id}`);
    });
    this.perform();
  }

  perform = async () => {
    this.emailQueue.process(`${rootPath}/src/jobs/EmailJobProcess.ts`);
  };
}

export const emailJob = new EmailJob();
