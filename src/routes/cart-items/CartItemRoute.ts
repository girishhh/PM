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
            "foodItem"
          );
          const userId = httpContext.get(USER_ID);
          const cart = await Cart.findOne({ customer: userId });
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            if (!isEmpty(cart)) {
              const cartItemObj = new CartItem({ ...formData, cart: cart?.id });
              const cartItem = await cartItemObj.save({ session });
              const updatedCart = await Cart.findByIdAndUpdate(
                cartItem.cart,
                {
                  $inc: { subTotal: cartItem.price },
                },
                { new: true, session }
              );
              if (updatedCart) {
                res.status(201).send();
              } else {
                await session.abortTransaction();
                res.status(422).json({ message: "Unable to save item" });
              }
            } else {
              const cartObj = new Cart({
                subTotal: formData.price,
                customer: userId,
              });
              await cartObj.save({ session });
              const cartItemObj = new CartItem({
                ...formData,
                cart: cartObj.id,
              });
              const cartItem = await cartItemObj.save({ session });
              if (cartItem) res.status(201).send();
            }
          });
        });
      }
    );

    this.router.put(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("quantity");
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            const cartItem = await CartItem.findByIdAndUpdate(
              req.params.id,
              formData,
              { new: true, session }
            );
            if (cartItem) {
              const cart = await Cart.findByIdAndUpdate(
                cartItem.cart,
                {
                  $inc: { subTotal: cartItem.price },
                },
                { new: true, session }
              );
              if (cart) {
                res.status(200).json(cart);
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
              res.status(204).send();
            }
          });
        });
      }
    );
  };
}

export const cartItemRoute = new CartItemRoute().router;
