import EmailConfig from "email-templates";
import rootPath from "app-root-path";

const Email = new EmailConfig({
  message: {
    from: process.env.EMAIL,
  },
  send: true,
  transport: {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PWD
    },
  },
  views: {
    options: {
      extension: "ejs",
    },
    root: `${rootPath}\\src\\views\\mails`,
  },
});

export { Email };
