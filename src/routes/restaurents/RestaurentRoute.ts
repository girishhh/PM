import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
// @ts-ignore
import params from "params";
import "express-async-errors";
import { Restaurent } from "../../db/models/RestaurentModel";

class RestaurentRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        const formData = params(req.body).only(
          "name",
          "city",
          "subdomain",
          "timeZone"
        );
        const restaurentObj = new Restaurent(formData);
        const restaurent = await restaurentObj.save();
        if (restaurent) res.status(201).json(restaurent);
      }
    );
  };
}

export const restaurentRoute = new RestaurentRoute().router;
