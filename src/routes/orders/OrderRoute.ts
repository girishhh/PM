import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
import mongoose from "mongoose";
// @ts-ignore
import params from "params";

class MenuRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("cartId", "payment");
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {});
        });
      }
    );
  };
}

export const menuRoute = new MenuRoute().router;
