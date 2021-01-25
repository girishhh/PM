import mongoose from "mongoose";
import {
  FoodItemInterface,
  FoodItemStatics,
} from "../../interfaces/FoodItemInterface";
import { FoodItemSchema } from "../schemas/FoodItemSchema";

const FoodItem = mongoose.model<FoodItemInterface, FoodItemStatics>(
  "FoodItem",
  FoodItemSchema
);

export { FoodItem };
