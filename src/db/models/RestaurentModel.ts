import mongoose from "mongoose";
import {
  RestaurentInterface,
  RestaurentStatics,
} from "../../interfaces/RestaurentInterface";
import { RestaurentSchema } from "../schemas/RestaurentSchema";

const Restaurent = mongoose.model<RestaurentInterface, RestaurentStatics>(
  "Restaurent",
  RestaurentSchema
);

export { Restaurent };
