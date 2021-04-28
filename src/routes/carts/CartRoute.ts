import express, { NextFunction, Request, Response, Router } from "express";
// @ts-ignore
import params from "params";
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

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("address");
          const cart = await Cart.findById(req.params.id);
          cart?.set(formData);
          const updatedCart = await cart?.save();
          const respJson = { cartDetails: updatedCart };
          res.status(204).json(respJson);
        });
      }
    );
  };
}

export const cartRoute = new CartRoute().router;
