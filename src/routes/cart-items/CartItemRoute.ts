import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
import { isEmpty } from "lodash";
import mongoose from "mongoose";
// @ts-ignore
import params from "params";
import { USER_ID } from "../../constants/UserConstants";
import { CartItem } from "../../db/models/CartItemModel";
import { Cart } from "../../db/models/CartModel";

class CartItemRoute {
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
          const formData = params(req.body).only(
            "price",
            "quantity",
            "foodItem",
            "restaurent"
          );
          const userId = httpContext.get(USER_ID);
          const cart = await Cart.findOne({ customer: userId });
          if (
            !isEmpty(cart) &&
            cart?.restaurent.toString() !== formData.restaurent
          ) {
            return res.status(422).json({
              message: "CART_EXISTS_FOR_OTHER_RESTAURENT",
            });
          }
          CartItem.saveCartItem(formData, res, userId, cart);
        });
      }
    );

    this.router.post(
      "/refreshCart",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only(
            "price",
            "quantity",
            "foodItem",
            "restaurent"
          );
          const userId = httpContext.get(USER_ID);
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            const cart = await Cart.findOneAndDelete(
              { customer: userId },
              { session }
            );
            if (cart) {
              const resp = await CartItem.deleteMany(
                { cart: cart.id },
                { session }
              );
              if (resp.ok) {
                const cartObj = new Cart({
                  subTotal: formData.price,
                  customer: userId,
                  restaurent: formData.restaurent,
                });
                await cartObj.save({ session });
                const cartItemObj = new CartItem({
                  ...formData,
                  cart: cartObj.id,
                });
                const cartItem = await cartItemObj.save({ session });
                if (cartItem) res.status(201).send();
              } else {
                await session.abortTransaction();
                res.status(422).json({ message: "Unable to refresh cart." });
              }
            } else {
              res.status(404).send();
            }
          });
        });
      }
    );

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("quantity", "incQuantity");
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            const cartItem = await CartItem.findByIdAndUpdate(
              req.params.id,
              formData,
              { new: true, session }
            ).exec();
            if (cartItem) {
              const cart = await Cart.findByIdAndUpdate(
                cartItem.cart,
                {
                  $inc: {
                    subTotal: formData.incQuantity
                      ? cartItem.price
                      : -cartItem.price,
                  },
                },
                { new: true, session }
              ).exec();
              if (cart) {
                res.status(200).send();
              } else {
                await session.abortTransaction();
                res.status(422).json({ message: "Unable to update item." });
              }
            } else {
              await session.abortTransaction();
              res.status(422).json({ message: "Unable to update item." });
            }
          });
        });
      }
    );

    this.router.delete(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            const cartItem = await CartItem.findOneAndDelete(
              {
                _id: req.params.id,
              },
              { session }
            );
            if (!cartItem) {
              res.status(404).send();
              return;
            }
            const cartItems = await CartItem.find({
              cart: cartItem.cart,
            }).session(session);
            if (isEmpty(cartItems)) {
              const cart = await Cart.findOneAndDelete(
                { _id: cartItem.cart },
                { session }
              );
              if (cart) {
                res.status(204).send();
              } else {
                res.status(422).json({ message: "Unable to delete item." });
                await session.abortTransaction();
              }
            } else {
              const cart = await Cart.findByIdAndUpdate(
                cartItem.cart,
                {
                  $inc: {
                    subTotal: -cartItem.price,
                  },
                },
                { new: true, session }
              ).exec();
              if (cart) {
                res.status(204).send();
              } else {
                await session.abortTransaction();
                res.status(404).send();
              }
            }
          });
        });
      }
    );
  };
}

export const cartItemRoute = new CartItemRoute().router;
