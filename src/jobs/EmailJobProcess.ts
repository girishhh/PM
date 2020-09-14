import AdminMailer from "../mailers/AdminMailer";

const emailProcess = async (job: any, done: any): Promise<void> => {
  try {
    switch (job.data.mailType) {
      case "createPasswordMail":
        job.progress(42);
        await AdminMailer.createPasswordMail(
          job.data.passwordLink,
          job.data.admin
        );
        done();
      default:
    }
  } catch (error) {
    done(new Error(error.message));
  }
};

export default emailProcess;
