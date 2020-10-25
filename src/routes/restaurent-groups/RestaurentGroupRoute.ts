import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
// @ts-ignore
import params from "params";
import "express-async-errors";
import { RestaurentGroup } from "../../db/models/RestaurentGroupModel";

class RestaurentGroupRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        const formData = params(req.body).only("name");
        const restaurentGroupObj = new RestaurentGroup(formData);
        const restaurentGroup = await restaurentGroupObj.save();
        if (restaurentGroup) res.status(201).json(restaurentGroup);
      }
    );
  };
}

export const restaurentGroupRoute = new RestaurentGroupRoute().router;
