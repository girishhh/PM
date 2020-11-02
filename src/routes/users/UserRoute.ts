import bcrypt from "bcrypt";
import { UI } from "bull-board";
import crypto from "crypto";
import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// @ts-ignore
import params from "params";
import { COMPANY_ID } from "../../constants/CompanyConstants";
import {
  ROLES,
  ROLES_NEEDS_PASSWORD_MAIL,
} from "../../constants/UserConstants";
import { Address } from "../../db/models/AddressModel";
import { User } from "../../db/models/UserModel";
import { allowed, defineAbilities } from "../../helpers/AbilityHelper";
import {
  getConfirmationLink,
  getCreatePasswordLink,
} from "../../helpers/AdminHelper";
import { UserInterface } from "../../interfaces/UserInterface";
import { emailJob } from "../../jobs/EmailJob";

class UserRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post("/", async (req, res, next) => {
      const userFormData = params(req.body).only(
        "firstName",
        "lastName",
        "city",
        "roles",
        "email"
      );
      if (ROLES_NEEDS_PASSWORD_MAIL.includes(userFormData.roles[0]))
        userFormData.token = crypto.randomBytes(20).toString("hex");
      const addressFormData = params(req.body).only("address");
      const currentUser = req.user as UserInterface;
      const ability = defineAbilities(currentUser.roles as ROLES[]);
      if (allowed(ability, userFormData.roles, "create")) {
        const session = await mongoose.startSession();
        const userObj = new User(userFormData);
        userObj.company = httpContext.get(COMPANY_ID);
        const addressObj = new Address({
          ...addressFormData,
          modelName: "User",
          modelId: userObj.id,
        });
        await session.withTransaction(async () => {
          const address = await addressObj.save({ session });
          if (address) {
            const user = await userObj.save({ session });
            if (user.token) {
              const passwordLink = getCreatePasswordLink(
                `${req.protocol}://${req.headers.host}`,
                userFormData.token
              );
              emailJob.emailQueue.add({
                mailType: "createPasswordMail",
                passwordLink,
                user: user.toJSON(),
              });
            }
            res.status(201).json(user);
          }
        });
      } else {
        res.status(401).send("UnAuthorized");
      }
    });

    this.router.put("/activate-account", async (req, res, next) => {
      const { token, password } = req.body;
      let user = await User.findOne({ token, active: false });
      if (user) {
        if (password) {
          user.set({ password, active: true });
        } else {
          user.set({ active: true });
        }
        user = await user.save();
      } else {
        res.status(404).send();
      }
      res.status(200).send(user?.toJSON());
    });

    this.router.post(
      "/sign-in",
      async (req: Request, res: Response, next: NextFunction) => {
        const formData = params(req.body).only("email", "password");
        const user = await User.findOne({ email: formData.email });
        if (user) {
          const passwordMatch = bcrypt.compareSync(
            formData.password,
            user.password
          );
          if (passwordMatch) {
            const accessToken = jwt.sign(
              user.toJSON(),
              process.env.JWT_SECRET as string
            );
            res.json({ accessToken }).status(200);
          } else {
            res
              .json({ message: "email or password is incorrect." })
              .status(404);
          }
        } else {
          res.json({ message: "email or password is incorrect." }).status(404);
        }
      }
    );

    this.router.post(
      "/sign-up",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const userFormData = params(req.body).only(
            "firstName",
            "lastName",
            "city",
            "email",
            "password"
          );
          userFormData.roles = ["customer"];
          userFormData.token = crypto.randomBytes(20).toString("hex");
          const addressFormData = params(req.body).only("address");
          const session = await mongoose.startSession();
          const userObj = new User(userFormData);
          const addressObj = new Address({
            ...addressFormData,
            modelName: "User",
            modelId: userObj.id,
          });
          await session.withTransaction(async () => {
            const address = await addressObj.save({ session });
            if (address) {
              const user = await userObj.save({ session });
              const confirmationLink = getConfirmationLink(
                `${req.protocol}://${req.headers.host}`,
                userFormData.token
              );
              emailJob.emailQueue.add({
                mailType: "sendConfirmationMail",
                confirmationLink,
                user: user.toJSON(),
              });
              res.status(201).json(user);
            }
          });
        });
      }
    );

    this.router.use("/queues", UI);
  };
}

export const userRoute = new UserRoute().router;
