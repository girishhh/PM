import mongoose from "mongoose";
import { OrderInterface } from "../../interfaces/OrderInterface";
import { OrderSchema } from "../schemas/OrderSchema";

const Order = mongoose.model<OrderInterface>("Order", OrderSchema);

export { Order };
