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
import { ROLES_NEEDS_PASSWORD_MAIL } from "../../constants/UserConstants";
import { Address } from "../../db/models/AddressModel";
import { Role } from "../../db/models/RoleModel";
import { User } from "../../db/models/UserModel";
import {
  getConfirmationLink,
  getCreatePasswordLink,
} from "../../helpers/AdminHelper";
import { allowed, getPermissionName } from "../../helpers/UserHelper";
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
      await httpContext.ns.runPromise(async () => {
        const userFormData = params(req.body).only(
          "firstName",
          "lastName",
          "city",
          "roles",
          "email",
          "company"
        );
        if (ROLES_NEEDS_PASSWORD_MAIL.includes(userFormData.roles[0]))
          userFormData.token = crypto.randomBytes(20).toString("hex");
        const addressFormData = params(req.body).only("address");
        const currentUser = req.user as UserInterface;
        if (
          allowed(
            currentUser.permissions,
            getPermissionName("create", userFormData.roles[0])
          )
        ) {
          const session = await mongoose.startSession();
          const roleName = userFormData.roles[0] as string;
          const roleId = await Role.findOne({ name: roleName.toLowerCase() });
          const userObj = new User({ ...userFormData, roles: [roleId] });
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
                  user: user.JSON(),
                });
              }
              res.status(201).json(user);
            }
          });
        } else {
          res.status(401).send("UnAuthorized");
        }
      });
    });

    this.router.put("/activate-account", async (req, res, next) => {
      await httpContext.ns.runPromise(async () => {
        const { token, password } = req.body;
        let updateAttributes = {};
        if (password) {
          updateAttributes = {
            password: bcrypt.hashSync(password, 10),
            active: true,
          };
        } else {
          updateAttributes = { active: true };
        }
        const user = await User.findOneAndUpdate(
          { token, active: false },
          updateAttributes,
          { new: true }
        ).exec();
        if (!user) res.status(404).send();
        res.status(200).send(user?.JSON());
      });
    });

    this.router.post(
      "/sign-in",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("email", "password");
          const user = await User.findOne({ email: formData.email }).populate(
            "roles"
          );
          if (user) {
            const passwordMatch = bcrypt.compareSync(
              formData.password,
              user.password
            );
            if (passwordMatch) {
              const accessToken = jwt.sign(
                user?.JSON(),
                process.env.JWT_SECRET as string
              );
              res.json({ accessToken }).status(200);
            } else {
              res
                .json({ message: "email or password is incorrect." })
                .status(404);
            }
          } else {
            res
              .json({ message: "email or password is incorrect." })
              .status(404);
          }
        });
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
            "password",
            "roles"
          );
          userFormData.token = crypto.randomBytes(20).toString("hex");
          const addressFormData = params(req.body).only("address");
          const session = await mongoose.startSession();
          const roleName = userFormData.roles[0] as string;
          const roleId = await Role.findOne({ name: roleName.toLowerCase() });
          const userObj = new User({ ...userFormData, roles: [roleId] });
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
                user: user.JSON(),
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
