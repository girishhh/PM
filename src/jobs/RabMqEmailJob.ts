import { queueWorker } from "workers/QueueWorker";
import UserMailer from "../mailers/UserMailer";

class RabMqEmailJob {
  static process(msg: any) {
    const message = JSON.parse(msg.content.toString());
    try {
      switch (message.mailType) {
        case "createPasswordMail":
          UserMailer.createPasswordMail(
            message.passwordLink,
            message.user
          ).then(() => queueWorker.subChannel?.ack(msg));
          break;
        case "sendConfirmationMail":
          //@ts-ignore
          // "".hh()
          UserMailer.sendConfirmationMail(
            message.confirmationLink,
            message.user
          ).then(() => queueWorker.subChannel?.ack(msg));
          break;
      }
    } catch (error) {
      // const buf = Buffer.from(JSON.stringify({...message, retry: 1}));      
      queueWorker.subChannel?.reject(msg, false);
    }
  }
}

export default RabMqEmailJob;
