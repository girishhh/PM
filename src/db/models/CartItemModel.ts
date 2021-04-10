import mongoose from "mongoose";
import { CartItemInterface } from "../../interfaces/CartItemInterface";
import { CartItemSchema } from "../schemas/CartItemSchema";

const CartItem = mongoose.model<CartItemInterface>("CartItem", CartItemSchema);

export { CartItem };
