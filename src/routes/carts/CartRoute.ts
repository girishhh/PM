import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
import { Cart } from "../../db/models/CartModel";

class CartRoute {
  router: Router;

  constructor() {
    this.router = express.Router();
    this.createRoutes();
  }

  private createRoutes = () => {
    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const cart = await Cart.findById(req.params.id);
          const respJson = { cartDetails: cart };
          res.status(200).json(respJson);
        });
      }
    );
  };
}

export const cartRoute = new CartRoute().router;
