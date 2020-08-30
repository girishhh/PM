import Queue from "bull";
import AdminMailer from "mailers/AdminMailer";
import { response } from "express";

class EmailJob {
  emailQueue: Queue.Queue<any>;
  constructor() {
    this.emailQueue = new Queue("email-queue", "redis://127.0.0.1:6379");
    this.perform();
  }

  perform = () => {
    this.emailQueue.process(async (job, done) => {
      try {
        switch (job.data.mailType) {
          case "createPasswordMail":
            job.progress(42);
            await AdminMailer.createPasswordMail();
            done();
          default:
        }
      } catch (error) {
        done(new Error(error.message));
      }
    });
  };
}

export const emailJob = new EmailJob();
