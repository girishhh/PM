import { rabbitMq } from "../jobs/RabbitMq";
import UserMailer from "../mailers/UserMailer";

class RabMqEmailJob {
  static process(msg: any) {
    const message = JSON.parse(msg.content.toString());
    switch (message.mailType) {
      case "createPasswordMail":
        UserMailer.createPasswordMail(message.passwordLink, message.user).then(()=>rabbitMq.subChannel?.ack(msg));
        break;
      case "sendConfirmationMail":
        UserMailer.sendConfirmationMail(
          message.confirmationLink,
          message.user
        ).then(()=>rabbitMq.subChannel?.ack(msg));
        break;
    }
  }
}

export default RabMqEmailJob;
