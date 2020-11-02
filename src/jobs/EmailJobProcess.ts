import UserMailer from "../mailers/UserMailer";

const emailProcess = async (job: any, done: any): Promise<void> => {
  try {
    switch (job.data.mailType) {
      case "createPasswordMail":
        job.progress(42);
        await UserMailer.createPasswordMail(
          job.data.passwordLink,
          job.data.user
        );
        done();
      case "sendConfirmationMail":
        job.progress(42);
        await UserMailer.sendConfirmationMail(
          job.data.confirmationLink,
          job.data.user
        );
        done();
      default:
    }
  } catch (error) {
    done(new Error(error.message));
  }
};

export default emailProcess;
