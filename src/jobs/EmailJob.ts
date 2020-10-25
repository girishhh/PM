import Queue from "bull";
import AdminMailer from "../mailers/AdminMailer";
import rootPath from "app-root-path";

class EmailJob {
  emailQueue: Queue.Queue<any>;
  constructor() {
    this.emailQueue = new Queue("email-queue", "redis://192.168.99.100:6379");
    this.perform();
  }

  perform = async () => {
    this.emailQueue.process(`${rootPath}/src/jobs/EmailJobProcess.ts`);
  };
}

export const emailJob = new EmailJob();
