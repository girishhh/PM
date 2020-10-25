import express, { Router } from "express";
import { Admin } from "../../db/models/AdminModel";
import crypto from "crypto";
import { createPasswordLink } from "../../helpers/AdminHelper";
import { UI } from "bull-board";
import { emailJob } from "../../jobs/EmailJob";
import "express-async-errors";
import { SuperAdmin } from "../../db/models/SuperAdminModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class SuperAdminRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post("/create-superadmin", async (req, res, next) => {
      const { firstName, lastName, email, password } = req.body;
      const superAdmin = new SuperAdmin({
        firstName,
        lastName,
        email,
        password,
      });
      const superAdminObj = await superAdmin.save();
      res.send(superAdminObj.toJSON()).status(200);
    });

    this.router.post("/auth/login", async (req, res, next) => {
      const { email, password } = req.body;
      const superAdmin = await SuperAdmin.findOne({ email });
      if (superAdmin) {
        const passwordMatch = bcrypt.compareSync(password, superAdmin.password);
        if (passwordMatch) {
          const accessToken = jwt.sign(
            superAdmin.toJSON(),
            process.env.JWT_SECRET as string
          );
          res.json({ accessToken }).status(200);
        } else {
          res.json({ message: "email or password is incorrect." }).status(404);
        }
      } else {
        res.json({ message: "email or password is incorrect." }).status(404);
      }
    });

    this.router.post("/admins", async (req, res, next) => {
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

    this.router.post("/auth/login");

    this.router.use("/queues", UI);
  };
}

export const superAdminRoute = new SuperAdminRoute().router;
