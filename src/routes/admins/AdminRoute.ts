import express, { Router } from "express";
import { Admin } from "../../db/models/AdminModel";
import crypto from "crypto";
import { createPasswordLink } from "../../helpers/AdminHelper";
import { UI } from "bull-board";
import { emailJob } from "../../jobs/EmailJob";
import "express-async-errors";

class AdminRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post("/", async (req, res, next) => {
      const { firstName, lastName, email, companyId, birthDate } = req.body;
      const token = crypto.randomBytes(20).toString("hex");
      const passwordLink = createPasswordLink(
        `${req.protocol}://${req.headers.host}`,
        token
      );
      const admin = new Admin({
        firstName,
        lastName,
        email,
        token,
        company: companyId,
      });
      const adminObj = await admin.save();
      emailJob.emailQueue.add({
        mailType: "createPasswordMail",
        passwordLink,
        admin: adminObj.toJSON(),
      });
      res.send(adminObj.toJSON()).status(200);
    });

    this.router.put("/create-password", async (req, res, next) => {
      const { token, password } = req.body;
      let admin = await Admin.findOne({ token, isActive: false });
      if (admin) {
        admin.set({ password, isActive: true });
        admin = await admin.save();
      } else {
        res.status(404).send();
      }
      res.status(200).send(admin?.toJSON());
    });

    this.router.post("/auth/login");

    this.router.use("/queues", UI);
  };
}

export const adminRoute = new AdminRoute().router;
