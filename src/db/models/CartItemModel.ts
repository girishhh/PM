import mongoose from "mongoose";
import {
  CartItemInterface,
  CartItemStatics,
} from "../../interfaces/CartItemInterface";
import { CartItemSchema } from "../schemas/CartItemSchema";

const CartItem = mongoose.model<CartItemInterface, CartItemStatics>(
  "CartItem",
  CartItemSchema
);

export { CartItem };
