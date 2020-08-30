import { Email } from "helpers/ConfigurationHelper";

class AdminMailer {
  static createPasswordMail = async () => {
    const resp = await Email.send({
      template: "CreatePassword",
      message: {
        to: "girikulkarni03@gmail.com",
      },
      locals: {
        user: { name: "Girish" },
      },
    });
  };
}

export default AdminMailer;
