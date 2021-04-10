import mongoose from "mongoose";
import { CartInterface } from "../../interfaces/CartInterface";
import { CartSchema } from "../schemas/CartSchema";

const Cart = mongoose.model<CartInterface>("Cart", CartSchema);

export { Cart };
