import express, { Router } from "express";
import { Admin } from "db/models/AdminModel";
import crypto from "crypto";
import { createPasswordLink } from "helpers/AdminHelper";
import { UI } from "bull-board";
import { emailJob } from "jobs/EmailJob";
import { logger } from "config/LoggerConfig";
import "express-async-errors";

class AdminRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post("/", async (req, res, next) => {
      const { firstName, lastName, email, companyId } = req.body;
      const token = crypto.randomBytes(20).toString("hex");
      const passwordLink = createPasswordLink(token);
      const admin = new Admin({
        firstName,
        lastName,
        email,
        token,
        company: companyId,
      });
      emailJob.emailQueue.add({
        mailType: "createPasswordMail",
        user: { name: "Girish" },
      });
      const adminObj = await admin.save();
      res.send(adminObj.toJSON()).status(200);
    });

    this.router.use("/queues", UI);
  };
}

export const adminRoute = new AdminRoute().router;
