import express, { NextFunction, Request, Response, Router } from "express";
import "express-async-errors";
import httpContext from "express-http-context";
import { isEmpty } from "lodash";
import mongoose from "mongoose";
// @ts-ignore
import params from "params";
import { Cart } from "../../db/models/CartModel";
import { OrderItem } from "../../db/models/OrderItemModel";
import { Order } from "../../db/models/OrderModel";
import { buildQueryConditions } from "../../helpers/MongooseHelper";
import { CartItemInterface } from "../../interfaces/CartItemInterface";
import { FoodItemInterface } from "../../interfaces/FoodItemInterface";

class OrderRoute {
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
          const formConditions = JSON.parse(formData.conditions);
          const queryCondition = formData.conditions
            ? buildQueryConditions(formConditions)
            : {};
          const orders = await Order.find(queryCondition)
            .skip(Number(formData.start))
            .limit(Number(formData.limit));
          const totalCount = await Order.countDocuments({}).exec();
          const userOrderCount = await Order.countDocuments({
            user: formConditions.user.$eq,
          }).exec();
          const respJson = {
            orderList: orders,
            total: totalCount,
            userOrderCount,
          };
          res.status(200).json(respJson);
        });
      }
    );

    this.router.post(
      "/",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const formData = params(req.body).only("cartId", "payment");
          const cart = await Cart.findById(formData.cartId).exec();
          if (!cart) return res.status(404).send();
          const cartJson = cart.toJSON();
          const cartItems = cartJson.cartItems;
          const cartAttributes = params(cartJson).except(
            "_id",
            "id",
            "__v",
            "cartItems"
          );
          cartAttributes.payment = formData.payment;
          const session = await mongoose.startSession();
          await session.withTransaction(async () => {
            const orderObj = new Order({
              ...cartAttributes,
              user: cartAttributes.customer,
            });
            const order = await orderObj.save({ session });
            if (!order) return res.status(422).send();
            const orderItemObjs = cartItems.map((item: CartItemInterface) => ({
              price: item.price,
              quantity: item.quantity,
              foodItem: (item.foodItem as FoodItemInterface)._id,
              order: order.id,
              company: item.company,
            }));
            const orderItems = await OrderItem.insertMany(orderItemObjs, {
              session,
            });
            if (isEmpty(orderItems)) {
              session.abortTransaction();
              return res.status(422).send();
            }
            const orderWithItems = await order
              .populate("orderItems")
              .execPopulate();
            res.status(201).json(orderWithItems);
          });
        });
      }
    );

    this.router.get(
      "/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        await httpContext.ns.runPromise(async () => {
          const order = await Order.findOne({ _id: req.params.id }).exec();
          if (!order) res.status(404).send();
          const respJson = { orderDetails: order };
          res.status(200).json(respJson);
        });
      }
    );
  };
}

export const orderRoute = new OrderRoute().router;
