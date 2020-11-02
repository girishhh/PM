import { Email } from "../helpers/ConfigurationHelper";
import { UserInterface } from "../interfaces/UserInterface";

class UserMailer {
  static createPasswordMail = async (
    passwordLink: string,
    user: UserInterface
  ) => {
    const resp = await Email.send({
      template: "CreatePassword",
      message: {
        to: user.email,
      },
      locals: {
        passwordLink,
        user,
      },
    });
  };

  static sendConfirmationMail = async (
    confirmationLink: string,
    user: UserInterface
  ) => {
    const resp = await Email.send({
      template: "ConfirmationMail",
      message: {
        to: user.email,
      },
      locals: {
        confirmationLink,
        user,
      },
    });
  };
}

export default UserMailer;
