import EmailConfig from "email-templates";
import rootPath from "app-root-path";

const Email = new EmailConfig({
  message: {
    from: "girikul123girikul@gmail.com",
  },
  send: true,
  transport: {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "girikul123girikul@gmail.com",
      pass: "giri123@",
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
