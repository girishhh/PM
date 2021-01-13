import EmailConfig from "email-templates";
import rootPath from "app-root-path";

const Email = new EmailConfig({
  message: {
    from: "girikulkarni03@gmail.com",
  },
  send: true,
  transport: {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "girikulkarni03@gmail.com",
      pass: "giri123@8147925885",
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
