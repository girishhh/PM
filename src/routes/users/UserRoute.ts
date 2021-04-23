import bcrypt from "bcrypt";
import { UI } from "bull-board";
import crypto from "crypto";
import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
import jwt from "jsonwebtoken";
import lodash from "lodash";
import mongoose from "mongoose";
// @ts-ignore
import params from "params";
import {
  ROLES,
  ROLES_NEEDS_PASSWORD_MAIL,
  USER_ID,
} from "../../constants/UserConstants";
import { Address } from "../../db/models/AddressModel";
import { Cart } from "../../db/models/CartModel";
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
    this.router.get(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.query).only(
            "start",
            "limit",
            "conditions"
          );
          const queryCondition = formData.conditions
            ? await User.buildQueryConditions(JSON.parse(formData.conditions))
            : {};
          const users = await User.find(queryCondition)
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await User.countDocuments();
          const respJson = { userList: users, total: totalCount };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.post("/", async (req, res, next) => {
      await httpContext.ns.runPromise(async () => {
        const userFormData = params(req.body).only(
          "firstName",
          "lastName",
          "city",
          "roles",
          "email",
          "company",
          "restaurents"
        );
        if (ROLES_NEEDS_PASSWORD_MAIL.includes(userFormData.roles[0]))
          userFormData.token = crypto.randomBytes(20).toString("hex");
        const currentUser = req.user as UserInterface;
        if (
          allowed(
            currentUser.permissions,
            getPermissionName("create", userFormData.roles[0])
          )
        ) {
          const adminExists = await User.checkAdminExistsWithEmail(
            userFormData
          );
          if (adminExists)
            return res.status(422).json({ message: "Email should be unique." });
          const ownerAlreadyExistsForReaturent = await User.duplicateOwnerForRestaurent(
            userFormData
          );
          if (ownerAlreadyExistsForReaturent)
            return res
              .status(422)
              .json({ message: "Owner already exists for restaurent" });
          const roleIds = await User.getRoleIdsFromNames(userFormData.roles);
          const userObj = new User({ ...userFormData, roles: roleIds });
          const user = await userObj.save();
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
        const user = await User.findOne({ token, active: false });
        if (!user) {
          res.status(404).json({
            message: "Unable to find user or account is already active.",
          });
          return;
        }
        if (password && user?.password) {
          res.status(422).json({
            message: "Password has already setup for this account.",
          });
          return;
        }
        user?.set(updateAttributes);
        const updatedUser = await user?.save();
        res.status(200).send(updatedUser?.JSON());
      });
    });

    this.router.put("/:id", async (req, res, next) => {
      await httpContext.ns.runPromise(async () => {
        const formData = params(req.body).only(
          "firstName",
          "lastName",
          "city",
          "roles",
          "restaurents"
        );
        if (!lodash.isEmpty(formData.roles))
          formData.roles = await User.getRoleIdsFromNames(formData.roles);
        const user = await User.findOneAndUpdate(
          { _id: req.params.id },
          formData,
          { new: true }
        ).exec();
        if (!user) res.status(404).send();
        res.status(204).send();
      });
    });

    this.router.get(
      "/cartDetails",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const cart = await Cart.findOne({
            customer: httpContext.get(USER_ID),
          })
            .populate("restaurent")
            .exec();
          const respJson = { cartDetails: cart };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.post(
      "/sign-in",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("email", "password", "role");
          const findQueryObj: { email: string; roles?: string } = {
            email: formData.email,
          };
          if (formData.role) {
            const role = await Role.findOne({ name: formData.role });
            findQueryObj.roles = role?.id;
          }

          const user = await User.findOne(findQueryObj).populate("roles");
          if (user) {
            const passwordMatch = bcrypt.compareSync(
              formData.password,
              user.password
            );
            if (passwordMatch) {
              if (!user.active)
                res.status(403).json({
                  message:
                    "Account is not active. Please activate by following instructions sent to your mail.",
                });
              const accessToken = jwt.sign(
                user?.JSON(),
                process.env.JWT_SECRET as string
              );
              res.json({ accessToken }).status(200);
            } else {
              res
                .status(404)
                .json({ message: "email or password is incorrect." });
            }
          } else {
            res
              .status(404)
              .json({ message: "email or password is incorrect." });
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
          let roleId = await Role.findOne({ name: ROLES.ADMIN });
          const user = await User.findOne({
            email: userFormData.email,
            roles: [(roleId as unknown) as string],
          });
          if (user)
            return res.status(422).json({ message: "Email should be unique." });
          userFormData.token = crypto.randomBytes(20).toString("hex");
          userFormData.password = bcrypt.hashSync(userFormData.password, 10);
          const addressFormData = params(req.body).only("address");
          const session = await mongoose.startSession();
          const roleName = userFormData.roles[0] as string;
          roleId = await Role.findOne({ name: roleName });
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

    this.router.post(
      "/resend-confirmation-instructions",
      async (req, res, next) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("email");
          const user = await User.findOne({ email: formData.email });
          if (user) {
            if (user.active) {
              res.status(422).json({ message: "User is already active." });
              return;
            }
            const token = crypto.randomBytes(20).toString("hex");
            user.set({ token });
            const updatedUser = await user.save();
            const confirmationLink = getConfirmationLink(
              `${req.protocol}://${req.headers.host}`,
              updatedUser.token
            );
            emailJob.emailQueue.add({
              mailType: "sendConfirmationMail",
              confirmationLink,
              user: updatedUser.JSON(),
            });
            res.status(202).json(updatedUser);
          } else {
            res.status(404).json({ message: "User not found." });
          }
        });
      }
    );

    this.router.use("/queues", UI);
  };
}

export const userRoute = new UserRoute().router;
