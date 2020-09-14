import Queue from "bull";
import AdminMailer from "../mailers/AdminMailer";
import rootPath from "app-root-path";

class EmailJob {
  emailQueue: Queue.Queue<any>;
  constructor() {
    this.emailQueue = new Queue("email-queue", "redis://127.0.0.1:6379");
    this.perform();
  }

  perform = async () => {
    this.emailQueue.process(`${rootPath}/src/jobs/EmailJobProcess.ts`);
  };
}

export const emailJob = new EmailJob();
