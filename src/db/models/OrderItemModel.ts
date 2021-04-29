import mongoose from "mongoose";
import { OrderItemInterface } from "../../interfaces/OrderItemInterface";
import { OrderItemSchema } from "../schemas/OrderItemSchema";

const OrderItem = mongoose.model<OrderItemInterface>(
  "OrderItem",
  OrderItemSchema
);

export { OrderItem };
