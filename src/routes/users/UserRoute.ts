import express, {
  NextFunction,
  Request as ExpressRequest,
  Response,
  Router,
} from "express";
// @ts-ignore
import params from "params";
import "express-async-errors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserInterface } from "../../interfaces/UserInterface";
import { allowed, defineAbilities } from "../../helpers/AbilityHelper";
import {
  ROLES,
  ROLES_NEEDS_PASSWORD_MAIL,
} from "../../constants/UserConstants";
import { User } from "../../db/models/UserModel";
import { Address } from "../../db/models/AddressModel";
import crypto from "crypto";
import { createPasswordLink } from "../../helpers/AdminHelper";
import { emailJob } from "../../jobs/EmailJob";
import { Request } from "../../interfaces/CommonInterface";

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
        "email",
        "modelName",
        "modelId"
      );
      userFormData.subdomain = (req as Request).subdomain;
      if (ROLES_NEEDS_PASSWORD_MAIL.includes(userFormData.roles[0]))
        userFormData.token = crypto.randomBytes(20).toString("hex");
      const addressFormData = params(req.body).only("address");
      const currentUser = req.user as UserInterface;
      const ability = defineAbilities(currentUser.roles as ROLES[]);
      if (allowed(ability, userFormData.roles, "create")) {
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
            if (user.token) {
              const passwordLink = createPasswordLink(
                `${req.protocol}://${req.headers.host}`,
                userFormData.token
              );
              emailJob.emailQueue.add({
                mailType: "createPasswordMail",
                passwordLink,
                admin: user.toJSON(),
              });
            }
            res.status(201).json(user);
          }
        });
      } else {
        res.status(401).send("UnAuthorized");
      }
    });

    this.router.put("/create-password", async (req, res, next) => {
      const { token, password } = req.body;
      let user = await User.findOne({ token, active: false });
      if (user) {
        user.set({ password, active: true });
        user = await user.save();
      } else {
        res.status(404).send();
      }
      res.status(200).send(user?.toJSON());
    });

    this.router.post(
      "/sign-in",
      async (req: ExpressRequest, res: Response, next: NextFunction) => {
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
  };
}

export const userRoute = new UserRoute().router;
