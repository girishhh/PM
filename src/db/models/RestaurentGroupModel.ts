import mongoose from "mongoose";
import { RestaurentGroupInterface } from "../../interfaces/RestaurentGroupInterface";
import { RestaurentGroupSchema } from "../schemas/RestaurentGroupSchema";

const RestaurentGroup = mongoose.model<RestaurentGroupInterface>(
  "RestaurentGroup",
  RestaurentGroupSchema
);

export { RestaurentGroup };
