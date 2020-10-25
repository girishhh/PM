import mongoose from "mongoose";
import { RestaurentInterface } from "../../interfaces/RestaurentInterface";
import { RestaurentSchema } from "../schemas/RestaurentSchema";

const Restaurent = mongoose.model<RestaurentInterface>(
  "Restaurent",
  RestaurentSchema
);

export { Restaurent };
