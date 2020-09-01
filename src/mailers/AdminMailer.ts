import { Email } from "helpers/ConfigurationHelper";
import { AdminInterface } from "interfaces/AdminInterface";

class AdminMailer {
  static createPasswordMail = async (
    passwordLink: string,
    admin: AdminInterface
  ) => {
    const resp = await Email.send({
      template: "CreatePassword",
      message: {
        to: admin.email,
      },
      locals: {
        passwordLink,
        admin,
      },
    });
  };
}

export default AdminMailer;
