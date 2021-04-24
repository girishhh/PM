import mongoose from "mongoose";
import { CartInterface, CartStatics } from "../../interfaces/CartInterface";
import { CartSchema } from "../schemas/CartSchema";

const Cart = mongoose.model<CartInterface, CartStatics>("Cart", CartSchema);

export { Cart };
